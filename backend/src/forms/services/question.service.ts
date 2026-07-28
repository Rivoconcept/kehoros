import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FormQuestion } from '../entities/form-question.entity';
import { FormOption } from '../entities/form-option.entity';
import { FormTemplate } from '../entities/form-template.entity';
import { QuestionType } from '../enums/question-type.enum';

export interface CreateQuestionInput {
  template_id: string;
  title: string;
  description?: string;
  type: QuestionType;
  required?: boolean;
  position?: number;
  points?: number;
  settings?: Record<string, any>;
}

export interface UpdateQuestionInput {
  title?: string;
  description?: string;
  type?: QuestionType;
  required?: boolean;
  position?: number;
  points?: number;
  settings?: Record<string, any>;
}

export interface CreateOptionInput {
  question_id: string;
  label: string;
  value: string;
  is_correct?: boolean;
  position?: number;
}

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(FormQuestion)
    private readonly questionRepo: Repository<FormQuestion>,
    @InjectRepository(FormOption)
    private readonly optionRepo: Repository<FormOption>,
    @InjectRepository(FormTemplate)
    private readonly templateRepo: Repository<FormTemplate>,
  ) {}

  async createQuestion(input: CreateQuestionInput): Promise<FormQuestion> {
    this.validateQuestionInput(input);

    const template = await this.templateRepo.findOne({ where: { id: input.template_id } });
    if (!template) {
      throw new NotFoundException(`Template with id ${input.template_id} not found`);
    }

    const question = this.questionRepo.create({
      template_id: input.template_id,
      title: input.title.trim(),
      description: input.description?.trim() ?? undefined,
      type: input.type,
      required: input.required ?? false,
      position: input.position ?? 0,
      points: input.points ?? 0,
      settings: input.settings ?? {},
    });

    return this.questionRepo.save(question);
  }

  async findByTemplate(templateId: string): Promise<FormQuestion[]> {
    return this.questionRepo.find({
      where: { template_id: templateId },
      relations: { options: true },
      order: { position: 'ASC' },
    });
  }

  async findOne(id: string): Promise<FormQuestion> {
    const question = await this.questionRepo.findOne({
      where: { id },
      relations: { options: true },
    });

    if (!question) {
      throw new NotFoundException(`Question with id ${id} not found`);
    }

    return question;
  }

  async updateQuestion(id: string, input: UpdateQuestionInput): Promise<FormQuestion> {
    const existing = await this.findOne(id);

    if (input.type && input.type !== existing.type) {
      this.validateTypeChange(existing.type, input.type);
    }

    const payload = {
      title: input.title?.trim() ?? existing.title,
      description: input.description?.trim() ?? existing.description,
      type: input.type ?? existing.type,
      required: input.required ?? existing.required,
      position: input.position ?? existing.position,
      points: input.points ?? existing.points,
      settings: input.settings ?? existing.settings,
    };

    this.validateQuestionInput({
      template_id: existing.template_id,
      ...payload,
    });

    await this.questionRepo.update(id, payload);

    return this.findOne(id);
  }

  async removeQuestion(id: string): Promise<void> {
    const question = await this.findOne(id);
    await this.questionRepo.remove(question);
  }

  async createOption(input: CreateOptionInput): Promise<FormOption> {
    const question = await this.findOne(input.question_id);

    if (!['radio', 'checkbox', 'select'].includes(question.type)) {
      throw new BadRequestException(`Question type ${question.type} does not support options`);
    }

    const option = this.optionRepo.create({
      question_id: input.question_id,
      label: input.label.trim(),
      value: input.value.trim(),
      is_correct: input.is_correct ?? false,
      position: input.position ?? 0,
    });

    return this.optionRepo.save(option);
  }

  async updateOption(
    id: string,
    input: Partial<CreateOptionInput>,
  ): Promise<FormOption> {
    const option = await this.optionRepo.findOne({ where: { id } });
    if (!option) {
      throw new NotFoundException(`Option with id ${id} not found`);
    }

    await this.optionRepo.update(id, {
      label: input.label?.trim() ?? option.label,
      value: input.value?.trim() ?? option.value,
      is_correct: input.is_correct ?? option.is_correct,
      position: input.position ?? option.position,
    });

    return this.optionRepo.findOneOrFail({ where: { id } });
  }

  async removeOption(id: string): Promise<void> {
    const option = await this.optionRepo.findOne({ where: { id } });
    if (!option) {
      throw new NotFoundException(`Option with id ${id} not found`);
    }

    await this.optionRepo.remove(option);
  }

  private validateQuestionInput(input: CreateQuestionInput): void {
    if (!input.title?.trim()) {
      throw new BadRequestException('Question title is required');
    }

    if (input.title.trim().length < 3) {
      throw new BadRequestException('Question title must contain at least 3 characters');
    }

    if (!input.type || !Object.values(QuestionType).includes(input.type)) {
      throw new BadRequestException('Invalid question type');
    }

    if (input.points !== undefined && (input.points < 0 || !Number.isInteger(input.points))) {
      throw new BadRequestException('Points must be a positive integer');
    }

    if (input.position !== undefined && input.position < 0) {
      throw new BadRequestException('Position must be a positive integer');
    }
  }

  private validateTypeChange(oldType: QuestionType, newType: QuestionType): void {
    const optionTypes = ['radio', 'checkbox', 'select'];
    const hadOptions = optionTypes.includes(oldType);
    const hasOptions = optionTypes.includes(newType);

    if (hadOptions && !hasOptions) {
      throw new BadRequestException(
        `Cannot change question type from ${oldType} to ${newType} while options exist`,
      );
    }
  }
}
