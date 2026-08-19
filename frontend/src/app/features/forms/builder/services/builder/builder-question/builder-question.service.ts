import { Injectable } from '@angular/core';

import { Question } from '../../../../models/question.model';
import { QuestionType } from '../../../../models/question-type.enum';

import { BuilderStateService } from '../builder-state.service';
import { QuestionPayloadBuilder } from './question-payload.builder';
import { QuestionApiMapper } from './question-api.mapper';
import { BuilderQuestionFactory } from './builder-question-factory';
import { Template } from 'src/app/features/forms/models/template.model';

@Injectable({
  providedIn: 'root'
})
export class BuilderQuestionService {

  constructor(
    private readonly state: BuilderStateService
  ) {}

  /**
   * Ajoute localement une nouvelle question au template courant.
   * L'enregistrement en base de données sera géré lors du Save global.
   */
  public addQuestion(type: QuestionType): void {
    try {
      const currentTemplate: Template = this.state.template ?? {
        id: `temp-${crypto.randomUUID()}`, // ID temporaire valide
        title: 'Nouveau Questionnaire',
        description: '',
        questions: [],
        published: false,
        archived: false,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // S'assurer que même si l'objet template existait mais avait un id vide (""), on lui passe un ID temporaire
      const templateId = currentTemplate.id?.trim() ? currentTemplate.id : `temp-${crypto.randomUUID()}`;

      const currentQuestions = currentTemplate.questions ?? [];

      const newQuestion = BuilderQuestionFactory.createDefaultQuestion(
        templateId,
        type,
        currentQuestions.length
      );

      const updatedQuestions = [...currentQuestions, newQuestion];

      this.state.updateTemplateLocal({
        ...currentTemplate,
        id: templateId,
        questions: updatedQuestions
      });

      this.state.selectQuestion(newQuestion.id);

    } catch (error) {
      console.error('[BuilderQuestionService] Erreur lors de l\'ajout de la question:', error);
      throw error;
    }
  }



  /**
   * Met à jour une question existante localement dans le State.
   */
  public updateQuestion(updatedQuestion: Question): void {
    try {
      if (!updatedQuestion || !updatedQuestion.id) {
        throw new Error('[BuilderQuestionService] Tentative de mise à jour d\'une question invalide ou sans ID.');
      }

      const template = this.state.template;

      if (!template) {
        console.warn('[BuilderQuestionService] Aucun template actif pour la mise à jour.');
        return;
      }

      const questionExists = template.questions?.some(q => q.id === updatedQuestion.id);

      if (!questionExists) {
        console.warn(`[BuilderQuestionService] Question avec l'ID ${updatedQuestion.id} introuvable.`);
        return;
      }

      const questions = (template.questions ?? []).map(q =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      );

      this.state.updateTemplateLocal({
        ...template,
        questions
      });

      this.state.selectQuestion(updatedQuestion.id);

    } catch (error) {
      console.error('[BuilderQuestionService] Erreur lors de la mise à jour de la question:', error);
      throw error;
    }
  }

  /**
   * Duplique une question sélectionnée en mémoire locale.
   */
  public duplicateQuestion(id: string): void {
    try {
      if (!id?.trim()) {
        throw new Error('[BuilderQuestionService] L\'ID de la question à dupliquer est obligatoire.');
      }

      const template = this.state.template;

      if (!template) {
        console.warn('[BuilderQuestionService] Aucun template actif pour la duplication.');
        return;
      }

      const originalQuestion = template.questions?.find(q => q.id === id);

      if (!originalQuestion) {
        console.warn(`[BuilderQuestionService] Question introuvable pour duplication (ID: ${id}).`);
        return;
      }

      const currentQuestions = template.questions ?? [];
      const duplicatedQuestion = BuilderQuestionFactory.createDuplicate(
        originalQuestion,
        template.id,
        currentQuestions.length
      );

      const questions = [...currentQuestions, duplicatedQuestion];

      this.state.updateTemplateLocal({
        ...template,
        questions
      });

      this.state.selectQuestion(duplicatedQuestion.id);

    } catch (error) {
      console.error('[BuilderQuestionService] Erreur lors de la duplication de la question:', error);
      throw error;
    }
  }

  /**
   * Supprime une question du State local et réordonne automatiquement la liste restante.
   */
  public removeQuestion(id: string): void {
    try {
      if (!id?.trim()) {
        throw new Error('[BuilderQuestionService] L\'ID de la question à supprimer est obligatoire.');
      }

      const template = this.state.template;

      if (!template) {
        console.warn('[BuilderQuestionService] Aucun template actif pour la suppression.');
        return;
      }

      const filteredQuestions = (template.questions ?? [])
        .filter(q => q.id !== id)
        .map((q, index) => ({
          ...q,
          order: index
        }));

      this.state.updateTemplateLocal({
        ...template,
        questions: filteredQuestions
      });

      const nextSelected = filteredQuestions[0] ?? null;
      this.state.setSelectedQuestion(nextSelected);

    } catch (error) {
      console.error('[BuilderQuestionService] Erreur lors de la suppression de la question:', error);
      throw error;
    }
  }

  /**
   * Expose le builder de payload (Délégué à la classe Builder).
   */
  public buildQuestionPayload(question: Question, templateId: string): Record<string, unknown> {
    return QuestionPayloadBuilder.build(question, templateId);
  }

  /**
   * Expose le mapper API (Délégué à la classe Mapper).
   */
  public mapQuestionFromApi(raw: Record<string, any>, fallback: Question): Question {
    return QuestionApiMapper.mapFromApi(raw, fallback);
  }
}