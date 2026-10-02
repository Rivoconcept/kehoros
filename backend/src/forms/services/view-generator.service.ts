import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FormQuestion } from '../entities/form-question.entity';

@Injectable()
export class ViewGeneratorService {
  private readonly logger = new Logger(ViewGeneratorService.name);

  constructor(private readonly dataSource: DataSource) {}

  /**
   * Crée ou met à jour une vue SQL dédiée à un modèle de formulaire.
   * Exemple de nom : view_form_3a9f...
   */
  async generateViewForTemplate(templateId: string, questions: FormQuestion[]): Promise<string> {
    const viewName = `view_form_${templateId.replace(/-/g, '_')}`;

    // Filtrer les questions qui collectent de la donnée (exclure TITLE, PARAGRAPH, SECTION, DIVIDER)
    const dataQuestions = questions.filter(
      (q) => !['TITLE', 'PARAGRAPH', 'SECTION', 'DIVIDER'].includes(q.type),
    );

    if (dataQuestions.length === 0) {
      return viewName;
    }

    // Construction des projections de colonnes JSONB -> SQL
    const columnProjections = dataQuestions
      .map((q) => {
        // Nettoyage de la clé / id de la question pour être utilisé comme nom de colonne
        const columnName = this.sanitizeColumnName(q.title || q.id);
        const questionKey = q.id;

        // Extraction JSONB de la forme answers->>'question_id'
        return `fr.answers->>'${questionKey}' AS "${columnName}"`;
      })
      .join(',\n  ');

    const query = `
      CREATE OR REPLACE VIEW "${viewName}" AS
      SELECT
        fr.id AS response_id,
        fr.user_id,
        fr.assignment_id,
        fr.created_at AS submitted_at,
        ${columnProjections}
      FROM form_responses fr
      WHERE fr.template_id = '${templateId}';
    `;

    try {
      await this.dataSource.query(query);
      this.logger.log(`Vue SQL générée avec succès : ${viewName}`);
      return viewName;
    } catch (error) {
      this.logger.error(`Erreur lors de la création de la vue SQL ${viewName}:`, error);
      throw error;
    }
  }

  private sanitizeColumnName(input: string): string {
    return input
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Enlève les accents
      .replace(/[^a-z0-9_]/g, '_')     // Remplace caractères spéciaux par _
      .replace(/^_+|_+$/g, '')        // Enlève les _ au début et à la fin
      .substring(0, 60);               // Limite la longueur du nom de colonne SQL
  }
}