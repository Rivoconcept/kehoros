import { Question } from '../../../../models/question.model';
import { QuestionType } from '../../../../models/question-type.enum';

export class BuilderQuestionPayloadBuilder {

  /**
   * Transforme notre modèle frontend Question vers le payload attendu par le backend NestJS.
   */
  public static build(question: Question, templateId: string): Record<string, any> {
    return {
      template_id: templateId,
      title: question.title?.trim() || 'New Question',
      description: question.description ?? '',
      type: (question.type ? String(question.type).toLowerCase() : 'text') as QuestionType,
      required: question.required ?? false,
      position: question.order ?? 0,
      points: question.score ?? 0,
      options: question.options ?? [],

      settings: {
        placeholder: question.placeholder ?? '',
        helpText: question.helpText ?? '',
        width: question.width ?? '100%',
        hidden: question.hidden ?? false,
        readOnly: question.readOnly ?? false,
        disabled: question.disabled ?? false,
        cssClass: question.cssClass,
        icon: question.icon,
        color: question.color,

        conditions: question.conditions,
        conditionGroups: question.conditionGroups,

        minLength: question.minLength,
        maxLength: question.maxLength,
        minValue: question.minValue,
        maxValue: question.maxValue,
        pattern: question.pattern,
        validationType: question.validationType,
        errorMessage: question.errorMessage,
        trimValue: question.trimValue,
        validateOnBlur: question.validateOnBlur,
        validationRules: question.validationRules,

        conditional: question.conditional,
        dependsOnQuestionId: question.dependsOnQuestionId,
        expectedValue: question.expectedValue,

        defaultValue: question.defaultValue,

        acceptedFileTypes: question.acceptedFileTypes,
        maxFileSize: question.maxFileSize,
        multipleFiles: question.multipleFiles,

        minScale: question.minScale,
        maxScale: question.maxScale,
        step: question.step,
        rangeMin: question.rangeMin,
        rangeMax: question.rangeMax,
        rangeStep: question.rangeStep,

        countryCode: question.countryCode,
        phoneFormat: question.phoneFormat,

        addressFields: question.addressFields,

        latitude: question.latitude,
        longitude: question.longitude,
        zoom: question.zoom,
        mapProvider: question.mapProvider,

        minDate: question.minDate,
        maxDate: question.maxDate,
        allowPastDate: question.allowPastDate,
        allowFutureDate: question.allowFutureDate,

        openInNewTab: question.openInNewTab,

        colorFormat: question.colorFormat,

        htmlContent: question.htmlContent,
        labelStyle: question.labelStyle,

        aiPrompt: question.aiPrompt,
        aiValidation: question.aiValidation,

        tags: question.tags,
        metadata: question.metadata
      }
    };
  }
}