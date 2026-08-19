import { Question } from '../../../../models/question.model';
import { QuestionType } from '../../../../models/question-type.enum';

export class BuilderQuestionFactory {

  /**
   * Crée une nouvelle instance de Question initialisée avec toutes les valeurs par défaut requises.
   */
  public static createDefaultQuestion(templateId: string, type: QuestionType, currentOrder: number): Question {
    if (!templateId?.trim()) {
      throw new Error('[BuilderQuestionFactory] Impossible de créer une question sans un ID de template valide.');
    }

    return {
      id: `temp-${crypto.randomUUID()}`,
      templateId,
      title: 'New Question',
      description: '',
      type,
      required: false,
      placeholder: '',
      helpText: '',
      order: currentOrder,
      score: 1,
      options: [],
      defaultValue: null,
      width: '100%',
      hidden: false,
      readOnly: false,
      disabled: false,
      countryCode: '+261',
      minScale: 1,
      maxScale: 10,
      step: 1,
      rangeMin: 0,
      rangeMax: 100,
      rangeStep: 1,
      latitude: -18.8792,
      longitude: 47.5079,
      zoom: 13,
      addressFields: {
        street: true,
        city: true,
        state: false,
        zip: true,
        country: true
      },
      allowPastDate: true,
      allowFutureDate: true,
      tags: [],
      metadata: {}
    };
  }


  /**
   * Duplique une question existante en générant un nouvel ID unique et des IDs d'options uniques.
   */
  public static createDuplicate(original: Question, templateId: string, currentOrder: number): Question {
    if (!original) {
      throw new Error('[BuilderQuestionFactory] Impossible de dupliquer une question nulle.');
    }

    return {
      ...original,
      id: `temp-${crypto.randomUUID()}`,
      title: `${original.title} (copy)`,
      templateId,
      order: currentOrder,
      options: (original.options ?? []).map(option => ({
        ...option,
        id: crypto.randomUUID()
      }))
    };
  }
}