import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Template } from '../../../../models/template.model';
import { Question } from '../../../../models/question.model';
import { FormsService } from '../../../../services/forms.services';
import { QuestionService } from '../../question.service';
import { BuilderStateService } from '../builder-state.service';
import { TemplateApiMapper } from './template-api.mapper';
import { BuilderQuestionPayloadBuilder } from './builder-question-payload.builder';

export interface SynchronizationOperation {
  type: 'create' | 'update' | 'delete';
  id: string;
  request: Observable<any>;
}

@Injectable({
  providedIn: 'root',
})
export class BuilderTemplateSyncOrchestrator {
  private creating = false;
  private persistedQuestionIds = new Set<string>();

  constructor(
    private formsService: FormsService,
    private questionService: QuestionService,
    private state: BuilderStateService
  ) {}

  public get isCreating(): boolean {
    return this.creating;
  }

  public setPersistedQuestionIds(ids: string[]): void {
    this.persistedQuestionIds = new Set(ids.filter((id): id is string => !!id));
  }

  public clearPersistedQuestionIds(): void {
    this.persistedQuestionIds.clear();
  }

  /**
   * À appeler lors du chargement initial d'un template existant depuis l'API
   */
  public initializePersistedQuestions(questions: any[]): void {
    this.persistedQuestionIds.clear();
    (questions || []).forEach((q) => {
      if (q.id) {
        this.persistedQuestionIds.add(q.id);
      }
    });
  }

  /**
   * Vérifie si un template est un nouveau formulaire (pas d'ID ou ID temporaire frontend)
   */
  private isNewTemplate(id?: string): boolean {
    return !id || id.startsWith('temp-');
  }

  /**
   * Synchronise les questions lors de la sauvegarde du template
   */
  public syncExistingQuestions(currentTemplate: any, result: any): void {
    const questions = currentTemplate.questions ?? [];

    // 1. Questions réellement enregistrées en BDD -> UPDATE (PATCH)
    const existingQuestions = questions.filter(
      (q: any) => !!q.id && !q.id.startsWith('temp-') && this.persistedQuestionIds.has(q.id)
    );

    // 2. Nouvelles questions (IDs temporaires 'temp-' ou non encore présentes dans persistedQuestionIds) -> CREATE (POST)
    const newQuestions = questions.filter(
      (q: any) => !q.id || q.id.startsWith('temp-') || !this.persistedQuestionIds.has(q.id)
    );

    // ... le reste du code reste inchangé

    // 3. Questions supprimées localement -> DELETE
    const currentQuestionIds = new Set(
      questions.map((q: any) => q.id).filter(Boolean)
    );
    const deletedQuestionIds = Array.from(this.persistedQuestionIds).filter(
      (id) => !currentQuestionIds.has(id)
    );

    const requests: Observable<any>[] = [];

    // Préparation des requêtes DELETE
    deletedQuestionIds.forEach((id) => {
      requests.push(
        this.questionService.deleteQuestion(id).pipe(
          tap(() => this.persistedQuestionIds.delete(id)),
          catchError((err) => {
            console.error(`Erreur suppression question ${id}`, err);
            return of(null);
          })
        )
      );
    });

    // Préparation des requêtes PATCH
    existingQuestions.forEach((question: any) => {
      const payload = BuilderQuestionPayloadBuilder.build(question, currentTemplate.id);
      requests.push(
        this.questionService.updateQuestion(question.id, payload).pipe(
          catchError((err) => {
            console.error(`Erreur modification question ${question.id}`, err);
            return of(null);
          })
        )
      );
    });

    // Préparation des requêtes POST
    newQuestions.forEach((question: any) => {
      const tempId = question.id;
      const payload = BuilderQuestionPayloadBuilder.build(question, currentTemplate.id);
      
      requests.push(
        this.questionService.createQuestion(payload).pipe(
          tap((response: any) => {
            const createdId = response?.id;
            if (createdId) {
              // Remplacer l'ID temporaire frontend par l'ID réel du serveur
              if (tempId && tempId !== createdId) {
                this.replaceLocalQuestionId(currentTemplate, tempId, createdId);
              } else {
                this.persistedQuestionIds.add(createdId);
              }
            }
          }),
          catchError((err) => {
            console.error(`Erreur création question`, err);
            return of(null);
          })
        )
      );
    });

    if (requests.length === 0) {
      this.finishExistingTemplateSave(currentTemplate, result);
      return;
    }

    // Exécution parallèle de toutes les opérations de synchronisation
    forkJoin(requests).subscribe({
      next: () => {
        this.finishExistingTemplateSave(currentTemplate, result);
      },
      error: (err) => {
        console.error('Erreur globale durant la synchronisation des questions', err);
        this.creating = false;
      }
    });
  }

  public saveTemplate(currentTemplate?: Template): void {
    const current = currentTemplate ?? this.state.template;

    if (!current) {
      console.warn('Impossible de sauvegarder : aucun template.');
      return;
    }

    if (this.creating) {
      console.warn('Une sauvegarde est déjà en cours.');
      return;
    }

    const payload = TemplateApiMapper.buildPayload(current);

    // CREATION D'UN NOUVEAU TEMPLATE
    if (this.isNewTemplate(current.id)) {
      this.creating = true;

      this.formsService.createTemplate(payload).subscribe({
        next: (result: any) => {
          const templateId = result['id'];
          const questions = current.questions ?? [];

          if (questions.length === 0) {
            this.finishSave(current, result);
            return;
          }

          this.saveNewTemplateQuestions(current, result, templateId, questions);
        },
        error: (error: unknown) => {
          this.creating = false;
          console.error('Erreur création template', error);
        }
      });
      return;
    }

    // MISE À JOUR D'UN TEMPLATE EXISTANT
    this.creating = true;

    this.formsService.updateTemplate(current.id, payload).subscribe({
      next: (result: any) => {
        this.syncExistingQuestions(current, result);
      },
      error: (error: unknown) => {
        this.creating = false;
        console.error('Erreur update template', error);
      }
    });
  }

  private saveNewTemplateQuestions(
    current: Template,
    result: any,
    templateId: string,
    questions: Question[]
  ): void {
    let saved = 0;
    let failed = false;

    questions.forEach((question) => {
      const tempId = question.id;
      const questionPayload = BuilderQuestionPayloadBuilder.build(question, templateId);

      this.questionService.createQuestion(questionPayload).subscribe({
        next: (savedQuestion: Question) => {
          saved++;

          if (savedQuestion?.id) {
            if (tempId && tempId !== savedQuestion.id) {
              this.replaceLocalQuestionId(current, tempId, savedQuestion.id);
            } else {
              this.persistedQuestionIds.add(savedQuestion.id);
            }
          }

          if (saved === questions.length && !failed) {
            this.finishSave(current, result);
          }
        },
        error: (error: unknown) => {
          failed = true;
          this.creating = false;
          console.error('Erreur création question', error);
        }
      });
    });
  }

  private replaceLocalQuestionId(template: Template, localId: string, backendId: string): void {
    const updatedQuestions = (template.questions || []).map((question) => {
      if (question.id !== localId) {
        return question;
      }
      return {
        ...question,
        id: backendId,
        templateId: template.id
      };
    });

    this.persistedQuestionIds.delete(localId);
    this.persistedQuestionIds.add(backendId);

    this.state.setTemplate({
      ...template,
      questions: updatedQuestions
    });
  }

  private finishSave(current: Template, result: any): void {
    this.creating = false;

    const savedTemplate: Template = {
      ...current,
      id: result['id'],
      updatedAt: new Date(result['updated_at'] ?? result['updatedAt'] ?? new Date())
    };

    this.persistedQuestionIds = new Set(
      (savedTemplate.questions ?? [])
        .map((q) => q.id)
        .filter((id): id is string => !!id)
    );

    this.state.setTemplate(savedTemplate);
    this.state.setDirty(false);
  }

  private finishExistingTemplateSave(current: Template, result: any): void {
    const activeTemplate = this.state.template ?? current;

    this.persistedQuestionIds = new Set(
      (activeTemplate.questions ?? [])
        .map((q) => q.id)
        .filter((id): id is string => !!id)
    );

    this.creating = false;

    this.state.setTemplate({
      ...activeTemplate,
      updatedAt: new Date(result['updated_at'] ?? result['updatedAt'] ?? new Date())
    });

    this.state.setDirty(false);
  }
}