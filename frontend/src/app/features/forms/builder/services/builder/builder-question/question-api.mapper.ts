import { Question } from '../../../../models/question.model';

/**
 * Structure typée des données brutes renvoyées par l'API Backend.
 */
export interface RawApiQuestion {
  id?: string | number;
  template_id?: string;
  templateId?: string;
  title?: string;
  description?: string;
  type?: any;
  required?: boolean;
  position?: number;
  order?: number;
  points?: number;
  score?: number;
  options?: any[];
  settings?: Record<string, any>;
  [key: string]: any;
}

export class QuestionApiMapper {

  /**
   * Mappe les données brutes renvoyées par l'API vers l'entité frontend `Question`.
   * Sécurise les types et applique des fallback en cas de valeurs manquantes ou nulles.
   */
  public static mapFromApi(raw: RawApiQuestion, fallback: Question): Question {
    if (!raw || typeof raw !== 'object') {
      console.warn('[QuestionApiMapper] Données API invalides fournies. Utilisation du fallback.', raw);
      return fallback;
    }

    const settings: Record<string, any> = raw['settings'] && typeof raw['settings'] === 'object' ? raw['settings'] : {};

    const rawId = raw['id'] ?? fallback.id;
    const rawTemplateId = raw['template_id'] ?? raw['templateId'] ?? fallback.templateId;
    const rawTitle = raw['title'] ?? fallback.title;
    const rawDescription = raw['description'] ?? fallback.description;
    const rawType = raw['type'] ?? fallback.type;
    const rawRequired = raw['required'] ?? fallback.required;
    const rawPosition = raw['position'];
    const rawOrder = raw['order'];
    const rawPoints = raw['points'];
    const rawScore = raw['score'];
    const rawOptions = raw['options'];

    return {
      ...fallback,
      id: String(rawId),
      templateId: String(rawTemplateId),
      title: String(rawTitle),
      description: String(rawDescription),
      type: rawType,
      required: Boolean(rawRequired),
      order: typeof rawPosition === 'number' ? rawPosition : (typeof rawOrder === 'number' ? rawOrder : fallback.order),
      score: typeof rawPoints === 'number' ? rawPoints : (typeof rawScore === 'number' ? rawScore : fallback.score),
      options: Array.isArray(rawOptions) ? rawOptions : (fallback.options ?? []),

      // UI
      placeholder: settings['placeholder'] ?? fallback.placeholder,
      helpText: settings['helpText'] ?? fallback.helpText,
      width: settings['width'] ?? fallback.width,
      hidden: settings['hidden'] ?? fallback.hidden,
      readOnly: settings['readOnly'] ?? fallback.readOnly,
      disabled: settings['disabled'] ?? fallback.disabled,
      cssClass: settings['cssClass'] ?? fallback.cssClass,
      icon: settings['icon'] ?? fallback.icon,
      color: settings['color'] ?? fallback.color,

      // Conditions
      conditions: settings['conditions'] ?? fallback.conditions,
      conditionGroups: settings['conditionGroups'] ?? fallback.conditionGroups,
      conditional: settings['conditional'] ?? fallback.conditional,
      dependsOnQuestionId: settings['dependsOnQuestionId'] ?? fallback.dependsOnQuestionId,
      expectedValue: settings['expectedValue'] ?? fallback.expectedValue,

      // Validation
      minLength: settings['minLength'] ?? fallback.minLength,
      maxLength: settings['maxLength'] ?? fallback.maxLength,
      minValue: settings['minValue'] ?? fallback.minValue,
      maxValue: settings['maxValue'] ?? fallback.maxValue,
      pattern: settings['pattern'] ?? fallback.pattern,
      validationType: settings['validationType'] ?? fallback.validationType,
      errorMessage: settings['errorMessage'] ?? fallback.errorMessage,
      trimValue: settings['trimValue'] ?? fallback.trimValue,
      validateOnBlur: settings['validateOnBlur'] ?? fallback.validateOnBlur,
      validationRules: settings['validationRules'] ?? fallback.validationRules,

      // Default & Files
      defaultValue: settings['defaultValue'] ?? fallback.defaultValue,
      acceptedFileTypes: settings['acceptedFileTypes'] ?? fallback.acceptedFileTypes,
      maxFileSize: settings['maxFileSize'] ?? fallback.maxFileSize,
      multipleFiles: settings['multipleFiles'] ?? fallback.multipleFiles,

      // Scales & Ranges
      minScale: settings['minScale'] ?? fallback.minScale,
      maxScale: settings['maxScale'] ?? fallback.maxScale,
      step: settings['step'] ?? fallback.step,
      rangeMin: settings['rangeMin'] ?? fallback.rangeMin,
      rangeMax: settings['rangeMax'] ?? fallback.rangeMax,
      rangeStep: settings['rangeStep'] ?? fallback.rangeStep,

      // Address & Location
      countryCode: settings['countryCode'] ?? fallback.countryCode,
      phoneFormat: settings['phoneFormat'] ?? fallback.phoneFormat,
      addressFields: settings['addressFields'] ?? fallback.addressFields,
      latitude: settings['latitude'] ?? fallback.latitude,
      longitude: settings['longitude'] ?? fallback.longitude,
      zoom: settings['zoom'] ?? fallback.zoom,
      mapProvider: settings['mapProvider'] ?? fallback.mapProvider,

      // Date & Média
      minDate: settings['minDate'] ?? fallback.minDate,
      maxDate: settings['maxDate'] ?? fallback.maxDate,
      allowPastDate: settings['allowPastDate'] ?? fallback.allowPastDate,
      allowFutureDate: settings['allowFutureDate'] ?? fallback.allowFutureDate,
      openInNewTab: settings['openInNewTab'] ?? fallback.openInNewTab,
      colorFormat: settings['colorFormat'] ?? fallback.colorFormat,
      htmlContent: settings['htmlContent'] ?? fallback.htmlContent,
      labelStyle: settings['labelStyle'] ?? fallback.labelStyle,

      // IA & Metadata
      aiPrompt: settings['aiPrompt'] ?? fallback.aiPrompt,
      aiValidation: settings['aiValidation'] ?? fallback.aiValidation,
      tags: settings['tags'] ?? fallback.tags,
      metadata: settings['metadata'] ?? fallback.metadata
    };
  }
}