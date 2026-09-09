import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateTemplateDto } from '../dto/create-template.dto';
import { FormOption } from '../entities/form-option.entity';
import { FormQuestion } from '../entities/form-question.entity';
import { FormTemplate } from '../entities/form-template.entity';
import { FormStatus } from '../enums/form-status.enum';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(FormTemplate)
    private readonly templateRepo: Repository<FormTemplate>,
    @InjectRepository(FormQuestion)
    private readonly questionRepo: Repository<FormQuestion>,
    @InjectRepository(FormOption)
    private readonly optionRepo: Repository<FormOption>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    input: Partial<CreateTemplateDto> & { created_by?: string },
  ): Promise<FormTemplate> {
    const payload = this.normalizePayload(input);

    this.validateTemplatePayload(payload, 'create');

    const template = this.templateRepo.create({
      ...payload,
      title: payload.title?.trim() ?? '',
      category: payload.category?.trim() ?? '',
      status: FormStatus.DRAFT,
      is_public: payload.is_public ?? false,
      created_by: payload.created_by ?? 'system',
    });

    return this.templateRepo.save(template);
  }

  async findAll(): Promise<FormTemplate[]> {
    return this.templateRepo.find({
      order: { created_at: 'DESC' },
      relations: {
        questions: {
          options: true,
        },
      },
    });
  }

  async findOne(id: string): Promise<FormTemplate> {
    const template = await this.templateRepo.findOne({
      where: { id },
      relations: {
        questions: {
          options: true,
        },
        assignments: true,
      },
    });

    if (!template) {
      throw new NotFoundException(`Template with id ${id} not found`);
    }

    return template;
  }

  async update(
    id: string,
    input: Partial<CreateTemplateDto> & { status?: FormStatus; created_by?: string },
  ): Promise<FormTemplate> {
    const existing = await this.templateRepo.findOne({ where: { id } });

    if (!existing) {
      throw new NotFoundException(`Template with id ${id} not found`);
    }

    const payload = this.normalizePayload({
      ...existing,
      ...input,
    });

    this.validateTemplatePayload(payload, 'update');

    await this.templateRepo.update(id, {
      title: payload.title?.trim(),
      description: payload.description?.trim() ?? undefined,
      category: payload.category?.trim(),
      status: payload.status ?? existing.status,
      is_public: payload.is_public ?? existing.is_public,
      duration_minutes: payload.duration_minutes ?? existing.duration_minutes,
      pass_score: payload.pass_score ?? existing.pass_score,
      created_by: payload.created_by ?? existing.created_by,
    });

    return this.findOne(id);
  }

  async publish(id: string): Promise<FormTemplate> {
    const template = await this.findOne(id);

    if (template.status === FormStatus.ARCHIVED) {
      throw new ConflictException('Cannot publish an archived template');
    }

    if (!template.title?.trim() || !template.category?.trim()) {
      throw new BadRequestException('Title and category are required before publishing');
    }

    await this.templateRepo.update(id, { status: FormStatus.PUBLISHED });

    return this.findOne(id);
  }

  async archive(id: string): Promise<FormTemplate> {
    const template = await this.findOne(id);

    if (template.status === FormStatus.ARCHIVED) {
      return template;
    }

    await this.templateRepo.update(id, { status: FormStatus.ARCHIVED });

    return this.findOne(id);
  }

  async duplicate(
    id: string,
    overrides?: Partial<CreateTemplateDto> & { created_by?: string; title?: string },
  ): Promise<FormTemplate> {
    return this.dataSource.transaction(async (manager) => {
      // 1. Récupérer le template source avec toutes ses relations
      const source = await manager.findOne(FormTemplate, {
        where: { id },
        relations: {
          questions: {
            options: true,
          },
        },
      });

      if (!source) {
        throw new NotFoundException(`Template with id ${id} not found`);
      }

      const safeTitle = overrides?.title?.trim() || `${source.title} (copy)`;
      const safeCategory = overrides?.category?.trim() || source.category;

      // 2. Créer une toute NOUVELLE instance de FormTemplate
      const newTemplate = manager.create(FormTemplate, {
        title: safeTitle,
        description: source.description ?? null,
        category: safeCategory,
        status: FormStatus.DRAFT,
        is_public: false,
        duration_minutes: source.duration_minutes ?? null,
        pass_score: source.pass_score ?? null,
        created_by: overrides?.created_by ?? source.created_by ?? 'system',
      });

      // Insertion en BDD -> Génération d'un NOUVEL ID unique
      const savedTemplate = await manager.save(FormTemplate, newTemplate);

      // 3. Dupliquer les questions avec les VRAIS noms de colonnes de FormQuestion
      if (source.questions && source.questions.length > 0) {
        for (const question of source.questions) {
          const newQuestion = manager.create(FormQuestion, {
            title: question.title ?? '',
            description: question.description ?? null,
            type: question.type,
            required: question.required ?? false,
            position: question.position ?? 0,
            points: question.points ?? 0,
            settings: question.settings ? { ...question.settings } : {},
            template_id: savedTemplate.id,
          });

          const savedQuestion = await manager.save(FormQuestion, newQuestion);

          // 4. Dupliquer les options avec les VRAIS noms de colonnes de FormOption
          if (question.options && question.options.length > 0) {
            const newOptions = question.options.map((option) =>
              manager.create(FormOption, {
                label: option.label ?? '',
                value: option.value ?? '',
                is_correct: option.is_correct ?? false,
                position: option.position ?? 0,
                question_id: savedQuestion.id,
              }),
            );

            await manager.save(FormOption, newOptions);
          }
        }
      }

      // 5. Retourner l'entité nouvellement insérée
      const result = await manager.findOne(FormTemplate, {
        where: { id: savedTemplate.id },
        relations: {
          questions: {
            options: true,
          },
        },
      });

      if (!result) {
        throw new NotFoundException(`Duplicated template with id ${savedTemplate.id} not found`);
      }

      return result;
    });
  }

  async remove(id: string): Promise<void> {
    const template = await this.findOne(id);
    await this.templateRepo.remove(template);
  }

  private normalizePayload(
    input: Partial<CreateTemplateDto> & {
      title?: string;
      description?: string;
      category?: string;
      created_by?: string;
      status?: FormStatus;
      is_public?: boolean;
      duration_minutes?: number;
      pass_score?: number;
    },
  ): Partial<CreateTemplateDto> & {
    created_by?: string;
    status?: FormStatus;
    is_public?: boolean;
    duration_minutes?: number;
    pass_score?: number;
  } {
    return {
      ...input,
      title: input.title?.trim(),
      description: input.description?.trim(),
      category: input.category?.trim(),
    };
  }

  private validateTemplatePayload(
    payload: Partial<CreateTemplateDto> & { status?: FormStatus; created_by?: string },
    operation: 'create' | 'update',
  ): void {
    if (!payload.title && operation === 'create') {
      throw new BadRequestException('Template title is required');
    }

    if (payload.title !== undefined && payload.title.trim().length < 3) {
      throw new BadRequestException('Template title must contain at least 3 characters');
    }

    if (!payload.category && operation === 'create') {
      throw new BadRequestException('Template category is required');
    }

    if (payload.category !== undefined && payload.category.trim().length < 2) {
      throw new BadRequestException('Template category must contain at least 2 characters');
    }

    if (
      payload.duration_minutes !== undefined &&
      (!Number.isInteger(payload.duration_minutes) || payload.duration_minutes < 0)
    ) {
      throw new BadRequestException('duration_minutes must be a positive integer');
    }

    if (
      payload.pass_score !== undefined &&
      (!Number.isInteger(payload.pass_score) || payload.pass_score < 0 || payload.pass_score > 100)
    ) {
      throw new BadRequestException('pass_score must be an integer between 0 and 100');
    }

    if (payload.status !== undefined && !Object.values(FormStatus).includes(payload.status)) {
      throw new BadRequestException('Invalid form status');
    }
  }
}