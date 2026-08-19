import { Injectable } from '@angular/core';

import { Template } from '../../../../models/template.model';
import { Question } from '../../../../models/question.model';
import { FormsService } from '../../../../services/forms.services';
import { BuilderStateService } from '../builder-state.service';
import { QuestionApiMapper } from '../builder-question/question-api.mapper';
import { TemplateApiMapper } from './template-api.mapper';
import { BuilderTemplateSyncOrchestrator } from './builder-template-save.orchestrator';


@Injectable({
  providedIn: 'root',
})
export class BuilderTemplateService {

  constructor(
    private formsService: FormsService,
    private state: BuilderStateService,
    private syncOrchestrator: BuilderTemplateSyncOrchestrator
  ) {}

  // ==========================================================
  // CREATION LOCALE DU TEMPLATE
  // ==========================================================

  public createTemplateLocal(data: {
    title: string;
    description?: string;
    category?: string;
  }): void {
    const template: Template = {
      id: '',
      title: data.title,
      description: data.description ?? '',
      category: data.category ?? 'general',
      published: false,
      archived: false,
      version: 1,
      status: 'DRAFT',
      questions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.syncOrchestrator.clearPersistedQuestionIds();
    this.state.setTemplate(template);
    this.state.setDirty(true);
  }

  // ==========================================================
  // CHARGEMENT TEMPLATE
  // ==========================================================

  public loadTemplate(id: string): void {
    this.formsService.getTemplateById(id).subscribe({
      next: (data: any) => {
        const rawQuestions = data['questions'] ?? [];

        const questions: Question[] = rawQuestions.map((question: any) =>
          QuestionApiMapper.mapFromApi(question, {
            id: '',
            templateId: id,
            title: '',
            description: '',
            type: '' as any,
            required: false,
            order: 0,
            score: 0,
            options: []
          })
        );

        const persistedIds = questions
          .map((q) => q.id)
          .filter((qId): qId is string => !!qId);

        this.syncOrchestrator.setPersistedQuestionIds(persistedIds);

        const template = TemplateApiMapper.mapFromApi(data, questions);

        this.state.setTemplate(template);
        this.state.setDirty(false);
      },
      error: (error: unknown) => {
        console.error('Erreur chargement template', error);
      }
    });
  }

  // ==========================================================
  // SAUVEGARDE TEMPLATE
  // ==========================================================

  public saveTemplate(template?: Template): void {
    this.syncOrchestrator.saveTemplate(template);
  }
}