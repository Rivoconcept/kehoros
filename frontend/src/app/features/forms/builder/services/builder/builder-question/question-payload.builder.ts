import { Question } from '../../../../models/question.model';

export class QuestionPayloadBuilder {

  /**
   * Construit le payload complet pour l'API Backend.
   * Transforme les clés frontend (order, score) vers backend (position, points)
   * et regroupe l'ensemble des métadonnées et configurations dans l'objet `settings`.
   */
  public static build(question: Question, templateId: string): Record<string, unknown> {
    if (!question) {
      throw new Error('[QuestionPayloadBuilder] La question fournie ne peut pas être nulle ou indéfinie.');
    }

    if (!templateId?.trim()) {
      throw new Error('[QuestionPayloadBuilder] L\'ID du template est requis pour construire le payload.');
    }

    return {
      template_id: templateId,
      title: question.title?.trim() || 'New Question',
      description: question.description ?? '',
      type: question.type ? question.type.toLowerCase() : 'text',
      required: Boolean(question.required),
      position: question.order ?? 0,
      points: question.score ?? 0,
      settings: {
        // UI & Style
        placeholder: question.placeholder ?? '',
        helpText: question.helpText ?? '',
        width: question.width ?? '100%',
        hidden: Boolean(question.hidden),
        readOnly: Boolean(question.readOnly),
        disabled: Boolean(question.disabled),
        cssClass: question.cssClass ?? null,
        icon: question.icon ?? null,
        color: question.color ?? null,

        // Logique Conditionnelle
        conditions: question.conditions ?? [],
        conditionGroups: question.conditionGroups ?? [],
        conditional: Boolean(question.conditional),
        dependsOnQuestionId: question.dependsOnQuestionId ?? null,
        expectedValue: question.expectedValue ?? null,

        // Règles de Validation
        minLength: question.minLength ?? null,
        maxLength: question.maxLength ?? null,
        minValue: question.minValue ?? null,
        maxValue: question.maxValue ?? null,
        pattern: question.pattern ?? null,
        validationType: question.validationType ?? null,
        errorMessage: question.errorMessage ?? null,
        trimValue: Boolean(question.trimValue),
        validateOnBlur: Boolean(question.validateOnBlur),
        validationRules: question.validationRules ?? [],

        // Valeurs par défaut
        defaultValue: question.defaultValue ?? null,

        // Gestion Fichiers
        acceptedFileTypes: question.acceptedFileTypes ?? [],
        maxFileSize: question.maxFileSize ?? null,
        multipleFiles: Boolean(question.multipleFiles),

        // Échelles, Notes & Ranges
        minScale: question.minScale ?? 1,
        maxScale: question.maxScale ?? 10,
        step: question.step ?? 1,
        rangeMin: question.rangeMin ?? 0,
        rangeMax: question.rangeMax ?? 100,
        rangeStep: question.rangeStep ?? 1,

        // Téléphone
        countryCode: question.countryCode ?? '+261',
        phoneFormat: question.phoneFormat ?? null,

        // Adresse
        addressFields: question.addressFields ?? {
          street: true,
          city: true,
          state: false,
          zip: true,
          country: true
        },

        // Géolocalisation / Carte
        latitude: question.latitude ?? -18.8792,
        longitude: question.longitude ?? 47.5079,
        zoom: question.zoom ?? 13,
        mapProvider: question.mapProvider ?? null,

        // Dates & Heures
        minDate: question.minDate ?? null,
        maxDate: question.maxDate ?? null,
        allowPastDate: question.allowPastDate ?? true,
        allowFutureDate: question.allowFutureDate ?? true,

        // URLs & Médias
        openInNewTab: Boolean(question.openInNewTab),
        colorFormat: question.colorFormat ?? null,
        htmlContent: question.htmlContent ?? null,
        labelStyle: question.labelStyle ?? null,

        // Fonctionnalités IA
        aiPrompt: question.aiPrompt ?? null,
        aiValidation: question.aiValidation ?? null,

        // Métadonnées & Tags
        tags: question.tags ?? [],
        metadata: question.metadata ?? {}
      }
    };
  }
}