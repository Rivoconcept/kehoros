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

import { CreateQuestionDto } from '../dto/create-question.dto';

export interface CreateQuestionInput extends CreateQuestionDto {}

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

  /**
   * Création d'une question.
   */
  async createQuestion(
    input: CreateQuestionInput,
  ): Promise<FormQuestion> {
    const normalizedType = this.normalizeQuestionType(input.type);

    const normalizedInput: CreateQuestionInput = {
      ...input,
      type: normalizedType,
    };

    this.validateQuestionInput(normalizedInput);

    const template = await this.templateRepo.findOne({
      where: {
        id: input.template_id,
      },
    });

    if (!template) {
      throw new NotFoundException(
        `Template with id ${input.template_id} not found`,
      );
    }

    const question = this.questionRepo.create({
      template_id: input.template_id,

      title: input.title.trim(),

      description:
        input.description?.trim() ?? undefined,

      type: normalizedType,

      required:
        input.required ?? false,

      position:
        input.position ?? 0,

      points:
        input.points ?? 0,

      settings:
        input.settings ?? {},
    });

    return this.questionRepo.save(question);
  }

  /**
   * Retourne toutes les questions d'un template.
   */
  async findByTemplate(
    templateId: string,
  ): Promise<FormQuestion[]> {
    return this.questionRepo.find({
      where: {
        template_id: templateId,
      },

      relations: {
        options: true,
      },

      order: {
        position: 'ASC',
      },
    });
  }

  /**
   * Retourne une question avec ses options.
   */
  async findOne(
    id: string,
  ): Promise<FormQuestion> {
    const question =
      await this.questionRepo.findOne({
        where: {
          id,
        },

        relations: {
          options: true,
        },
      });

    if (!question) {
      throw new NotFoundException(
        `Question with id ${id} not found`,
      );
    }

    return question;
  }

  /**
   * Modification d'une question.
   *
   * Les settings sont remplacés uniquement lorsqu'ils
   * sont réellement fournis.
   */
  async updateQuestion(
    id: string,
    input: UpdateQuestionInput,
  ): Promise<FormQuestion> {
    const existing =
      await this.findOne(id);

    const normalizedType =
      input.type
        ? this.normalizeQuestionType(input.type)
        : existing.type;

    if (
      normalizedType !== existing.type
    ) {
      this.validateTypeChange(
        existing.type,
        normalizedType,
      );
    }

    const payload = {
      title:
        input.title !== undefined
          ? input.title.trim()
          : existing.title,

      description:
        input.description !== undefined
          ? input.description.trim()
          : existing.description,

      type:
        normalizedType,

      required:
        input.required !== undefined
          ? input.required
          : existing.required,

      position:
        input.position !== undefined
          ? input.position
          : existing.position,

      points:
        input.points !== undefined
          ? input.points
          : existing.points,

      settings:
        input.settings !== undefined
          ? input.settings
          : existing.settings ?? {},
    };

    this.validateQuestionInput({
      template_id:
        existing.template_id,

      title:
        payload.title,

      description:
        payload.description ?? undefined,

      type:
        payload.type,

      required:
        payload.required,

      position:
        payload.position,

      points:
        payload.points,

      settings:
        payload.settings,
    });

    await this.questionRepo.update(
      id,
      payload,
    );

    return this.findOne(id);
  }

  /**
   * Suppression d'une question.
   */
  async removeQuestion(
    id: string,
  ): Promise<void> {
    const question =
      await this.findOne(id);

    await this.questionRepo.remove(
      question,
    );
  }

  /**
   * Création d'une option.
   */
  async createOption(
    input: CreateOptionInput,
  ): Promise<FormOption> {
    const question =
      await this.findOne(
        input.question_id,
      );

    const optionTypes = [
      QuestionType.RADIO,
      QuestionType.CHECKBOX,
      QuestionType.SELECT,
    ];

    if (
      !optionTypes.includes(
        question.type,
      )
    ) {
      throw new BadRequestException(
        `Question type ${question.type} does not support options`,
      );
    }

    const option =
      this.optionRepo.create({
        question_id:
          input.question_id,

        label:
          input.label.trim(),

        value:
          input.value.trim(),

        is_correct:
          input.is_correct ?? false,

        position:
          input.position ?? 0,
      });

    return this.optionRepo.save(
      option,
    );
  }

  /**
   * Modification d'une option.
   */
  async updateOption(
    id: string,
    input: Partial<CreateOptionInput>,
  ): Promise<FormOption> {
    const option =
      await this.optionRepo.findOne({
        where: {
          id,
        },
      });

    if (!option) {
      throw new NotFoundException(
        `Option with id ${id} not found`,
      );
    }

    await this.optionRepo.update(
      id,
      {
        label:
          input.label?.trim() ??
          option.label,

        value:
          input.value?.trim() ??
          option.value,

        is_correct:
          input.is_correct ??
          option.is_correct,

        position:
          input.position ??
          option.position,
      },
    );

    return this.optionRepo.findOneOrFail({
      where: {
        id,
      },
    });
  }

  /**
   * Suppression d'une option.
   */
  async removeOption(
    id: string,
  ): Promise<void> {
    const option =
      await this.optionRepo.findOne({
        where: {
          id,
        },
      });

    if (!option) {
      throw new NotFoundException(
        `Option with id ${id} not found`,
      );
    }

    await this.optionRepo.remove(
      option,
    );
  }

  /**
   * Normalisation du type.
   *
   * Le frontend peut envoyer :
   *
   * TEXT
   * text
   *
   * Le backend stocke toujours :
   *
   * text
   */
  private normalizeQuestionType(
    type: QuestionType | string,
  ): QuestionType {
    if (
      !type ||
      typeof type !== 'string'
    ) {
      throw new BadRequestException(
        `Invalid question type: ${type}`,
      );
    }

    return type.toLowerCase() as QuestionType;
  }

  /**
   * Validation commune.
   */
  private validateQuestionInput(
    input: CreateQuestionInput,
  ): void {
    if (!input.title?.trim()) {
      throw new BadRequestException(
        'Question title is required',
      );
    }

    if (
      input.title.trim().length < 3
    ) {
      throw new BadRequestException(
        'Question title must contain at least 3 characters',
      );
    }

    const normalizedType =
      this.normalizeQuestionType(
        input.type,
      );

    if (
      !Object.values(
        QuestionType,
      ).includes(
        normalizedType,
      )
    ) {
      throw new BadRequestException(
        `Invalid question type: ${input.type}`,
      );
    }

    if (
      input.points !== undefined &&
      (
        input.points < 0 ||
        !Number.isInteger(
          input.points,
        )
      )
    ) {
      throw new BadRequestException(
        'Points must be a positive integer',
      );
    }

    if (
      input.position !== undefined &&
      (
        input.position < 0 ||
        !Number.isInteger(
          input.position,
        )
      )
    ) {
      throw new BadRequestException(
        'Position must be a positive integer',
      );
    }

    if (
      input.settings !== undefined &&
      (
        typeof input.settings !==
        'object' ||
        Array.isArray(
          input.settings,
        )
      )
    ) {
      throw new BadRequestException(
        'settings must be an object',
      );
    }
  }

  /**
   * Empêche de changer une question possédant
   * des options vers un type qui ne les supporte pas.
   */
  private validateTypeChange(
    oldType: QuestionType,
    newType: QuestionType,
  ): void {
    const optionTypes = [
      QuestionType.RADIO,
      QuestionType.CHECKBOX,
      QuestionType.SELECT,
    ];

    const hadOptions =
      optionTypes.includes(
        oldType,
      );

    const hasOptions =
      optionTypes.includes(
        newType,
      );

    if (
      hadOptions &&
      !hasOptions
    ) {
      throw new BadRequestException(
        `Cannot change question type from ${oldType} to ${newType} while options exist`,
      );
    }
  }
}

