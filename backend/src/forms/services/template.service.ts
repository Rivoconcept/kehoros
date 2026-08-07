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

      const { questions, assignments, ...templateData } = source as FormTemplate & {
        questions?: FormQuestion[];
        assignments?: unknown[];
      };

      const duplicatedTemplate = manager.create(FormTemplate, {
        ...templateData,
        title: safeTitle,
        category: safeCategory,
        status: FormStatus.DRAFT,
        is_public: false,
        created_by: overrides?.created_by ?? source.created_by ?? 'system',
      });

      const savedTemplate = await manager.save(FormTemplate, duplicatedTemplate);

      for (const question of source.questions ?? []) {
        const { id: _questionId, template, options, ...questionData } = question as FormQuestion & {
          template?: FormTemplate;
          options?: FormOption[];
        };

        const savedQuestion = await manager.save(FormQuestion, manager.create(FormQuestion, {
          ...questionData,
          template: savedTemplate,
          template_id: savedTemplate.id,
        }));

        if (question.options?.length) {
          const duplicatedOptions = question.options.map((option) => {
            const { id: _optionId, question: _optionQuestion, ...optionData } = option as FormOption & {
              question?: FormQuestion;
            };

            return manager.create(FormOption, {
              ...optionData,
              question: savedQuestion,
              question_id: savedQuestion.id,
            });
          });

          await manager.save(FormOption, duplicatedOptions);
        }
      }

      const duplicated = await manager.findOne(FormTemplate, {
        where: { id: savedTemplate.id },
        relations: {
          questions: {
            options: true,
          },
        },
      });

      if (!duplicated) {
        throw new NotFoundException(`Duplicated template with id ${savedTemplate.id} not found`);
      }

      return duplicated;
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
