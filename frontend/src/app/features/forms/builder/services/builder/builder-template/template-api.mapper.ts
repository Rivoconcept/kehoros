import { Template } from '../../../../models/template.model';

// Type helper basé sur votre modèle Template
type TemplateStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface RawApiTemplate {
  id?: string;
  title?: string;
  description?: string;
  category?: string;
  status?: string;
  published?: boolean;
  archived?: boolean;
  version?: number;
  questions?: any[];
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  [key: string]: any;
}

export class TemplateApiMapper {

  /**
   * Convertit un template renvoyé par l'API backend vers le modèle Template du frontend.
   */
  public static mapFromApi(raw: RawApiTemplate, mappedQuestions: any[] = []): Template {
    if (!raw || typeof raw !== 'object') {
      throw new Error('[TemplateApiMapper] Les données brutes fournies sont invalides.');
    }

    const rawId = raw['id'] ?? '';
    const rawTitle = raw['title'] ?? '';
    const rawDescription = raw['description'] ?? '';
    const rawCategory = raw['category'] ?? '';
    const rawStatus = raw['status'];
    const rawPublished = raw['published'] ?? (rawStatus === 'PUBLISHED');
    const rawArchived = raw['archived'] ?? (rawStatus === 'ARCHIVED');
    const rawVersion = raw['version'] ?? 1;

    const createdAtRaw = raw['created_at'] ?? raw['createdAt'];
    const updatedAtRaw = raw['updated_at'] ?? raw['updatedAt'];

    // Normalisation et assertion de type sécurisée pour status
    const status: TemplateStatus = (
      rawStatus === 'PUBLISHED' || rawStatus === 'ARCHIVED' || rawStatus === 'DRAFT'
    ) ? rawStatus : 'DRAFT';

    return {
      id: String(rawId),
      title: String(rawTitle),
      description: String(rawDescription),
      category: String(rawCategory),
      published: Boolean(rawPublished),
      archived: Boolean(rawArchived),
      version: Number(rawVersion),
      status: status, // Type restreint à 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
      questions: mappedQuestions,
      createdAt: createdAtRaw ? new Date(createdAtRaw) : new Date(),
      updatedAt: updatedAtRaw ? new Date(updatedAtRaw) : new Date()
    };
  }

  /**
   * Construit le payload JSON envoyé lors de la création ou mise à jour du Template.
   */
  public static buildPayload(template: Template): Record<string, any> {
    return {
      title: template.title,
      description: template.description ?? '',
      category: template.category ?? 'general'
    };
  }
}