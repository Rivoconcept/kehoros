import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FormAnswer } from '../entities/form-answer.entity';
import { FormResponse } from '../entities/form-response.entity';
import { FormAssignment } from '../entities/form-assignment.entity';
import { FormTemplate } from '../entities/form-template.entity';
import { FormQuestion } from '../entities/form-question.entity';
import { In, IsNull, Not } from 'typeorm';

export interface StartResponseInput {
  assignment_id: string;
  user_id: string;
}

export interface SubmitResponseInput {
  response_id: string;
  answers: Array<{
    question_id: string;
    answer_text?: string;
    answer_number?: number;
    answer_boolean?: boolean;
    selected_option_id?: string;
    json_value?: unknown;
  }>;
}

export interface DirectSubmitResponseInput {
  template_id: string;
  assignment_id?: string;
  user_id?: string;
  answers: Record<string, unknown>;
}

@Injectable()
export class ResponseService {
  constructor(
    @InjectRepository(FormResponse)
    private readonly responseRepo: Repository<FormResponse>,
    @InjectRepository(FormTemplate)
    private readonly templateRepo: Repository<FormTemplate>,
    @InjectRepository(FormAnswer)
    private readonly answerRepo: Repository<FormAnswer>,
    @InjectRepository(FormAssignment)
    private readonly assignmentRepo: Repository<FormAssignment>,
    @InjectRepository(FormQuestion)
    private readonly questionRepo: Repository<FormQuestion>,
  ) {}

  async start(input: StartResponseInput): Promise<FormResponse> {
    if (!input.assignment_id?.trim()) {
      throw new BadRequestException('assignment_id is required');
    }

    if (!input.user_id?.trim()) {
      throw new BadRequestException('user_id is required');
    }

    const assignment = await this.assignmentRepo.findOne({ where: { id: input.assignment_id } });
    if (!assignment) {
      throw new NotFoundException(`Assignment with id ${input.assignment_id} not found`);
    }

    const response = this.responseRepo.create({
      template_id: assignment.template_id,
      assignment_id: input.assignment_id,
      user_id: input.user_id,
      started_at: new Date(),
    });

    return this.responseRepo.save(response);
  }

  async findByAssignment(assignmentId: string): Promise<FormResponse[]> {
    return this.responseRepo.find({
      where: { assignment_id: assignmentId },
      order: { started_at: 'DESC' },
    });
  }

  async getAssignmentResult(assignmentId: string) {
    const assignment = await this.assignmentRepo.findOne({
      where: { id: assignmentId },
      relations: { template: true, user: true },
    });
    if (!assignment) {
      throw new NotFoundException(`Assignment with id ${assignmentId} not found`);
    }

    const responses = await this.findByAssignment(assignmentId);
    let response = responses.find((item) => Boolean(item.submitted_at));

    if (!response && assignment.user_id) {
      response = (await this.responseRepo.findOne({
        where: {
          template_id: assignment.template_id,
          user_id: assignment.user_id,
          assignment_id: IsNull(),
          submitted_at: Not(IsNull()),
        },
        order: { submitted_at: 'DESC' },
      })) ?? undefined;

      if (response) {
        await this.responseRepo.update(response.id, { assignment_id: assignment.id });
        await this.assignmentRepo.update(assignment.id, {
          status: 'completed',
          completed_at: response.submitted_at,
        });
      }
    }

    const answerRecords = response
      ? await this.answerRepo.find({ where: { response_id: response.id } })
      : [];
    const normalizedAnswers = answerRecords.length
      ? answerRecords.map((answer) => ({
          question_id: answer.question_id,
          userAnswer:
            answer.answer_text ??
            answer.answer_number ??
            answer.answer_boolean ??
            answer.json_value ??
            answer.selected_option_id ??
            '',
        }))
      : Object.entries(response?.answers ?? {}).map(([question_id, userAnswer]) => ({
          question_id,
          userAnswer,
        }));
    const questions = normalizedAnswers.length
      ? await this.questionRepo.find({
          where: { id: In(normalizedAnswers.map((answer) => answer.question_id)) },
        })
      : [];
    const questionsById = new Map(questions.map((question) => [question.id, question]));

    return {
      assignmentId,
      status: response ? 'completed' : assignment.status,
      template: assignment.template,
      user: assignment.user,
      completed_at: response?.submitted_at ?? assignment.completed_at,
      time_spent_minutes: response?.duration_seconds
        ? Math.round(response.duration_seconds / 60)
        : 0,
      is_test: false,
      questions: normalizedAnswers.map((answer) => ({
        id: answer.question_id,
        label: questionsById.get(answer.question_id)?.title ?? 'Question',
        type: questionsById.get(answer.question_id)?.type ?? 'text',
        userAnswer: answer.userAnswer,
      })),
    };
  }

  async findOne(id: string): Promise<FormResponse> {
    const response = await this.responseRepo.findOne({ where: { id } });
    if (!response) {
      throw new NotFoundException(`Response with id ${id} not found`);
    }

    return response;
  }

  async submit(
    input: SubmitResponseInput | DirectSubmitResponseInput,
  ): Promise<FormResponse> {
    if ('template_id' in input) {
      if (!input.template_id?.trim()) {
        throw new BadRequestException('template_id is required');
      }

      if (!input.answers || typeof input.answers !== 'object' || Array.isArray(input.answers)) {
        throw new BadRequestException('answers must be an object');
      }

      const template = await this.templateRepo.findOne({
        where: { id: input.template_id },
      });
      if (!template) {
        throw new NotFoundException(`Template with id ${input.template_id} not found`);
      }

      const assignment = input.assignment_id
        ? await this.assignmentRepo.findOne({ where: { id: input.assignment_id } })
        : null;
      if (input.assignment_id && !assignment) {
        throw new NotFoundException(`Assignment with id ${input.assignment_id} not found`);
      }
      if (assignment && assignment.template_id !== template.id) {
        throw new BadRequestException('Assignment does not belong to this template');
      }

      const belongsToUser = Boolean(
        assignment && (!assignment.user_id || assignment.user_id === input.user_id),
      );

      const submittedAt = new Date();
      const response = this.responseRepo.create({
        template_id: template.id,
        assignment_id: belongsToUser ? assignment?.id : undefined,
        user_id: input.user_id,
        answers: input.answers,
        started_at: submittedAt,
        submitted_at: submittedAt,
        duration_seconds: 0,
        status: 'SUBMITTED',
      });

      const savedResponse = await this.responseRepo.save(response);
      if (belongsToUser && assignment) {
        await this.assignmentRepo.update(assignment.id, {
          status: 'completed',
          completed_at: submittedAt,
        });
      }

      return savedResponse;
    }

    const response = await this.findOne(input.response_id);

    if (response.submitted_at) {
      throw new BadRequestException('This response has already been submitted');
    }

    for (const answer of input.answers ?? []) {
      const entity = this.answerRepo.create({
        response_id: response.id,
        session_id: response.assignment_id,
        question_id: answer.question_id,
        answer_text: answer.answer_text,
        answer_number: answer.answer_number,
        answer_boolean: answer.answer_boolean,
        selected_option_id: answer.selected_option_id,
        json_value: answer.json_value as any,
      });

      await this.answerRepo.save(entity);
    }

    await this.responseRepo.update(response.id, {
      submitted_at: new Date(),
      duration_seconds: this.computeDurationSeconds(response.started_at),
    });
    await this.assignmentRepo.update(response.assignment_id, {
      status: 'completed',
      completed_at: new Date(),
    });

    return this.findOne(response.id);
  }

  async saveDraft(input: SubmitResponseInput): Promise<FormResponse> {
    const response = await this.findOne(input.response_id);

    for (const answer of input.answers ?? []) {
      const entity = this.answerRepo.create({
        response_id: response.id,
        session_id: response.assignment_id,
        question_id: answer.question_id,
        answer_text: answer.answer_text,
        answer_number: answer.answer_number,
        answer_boolean: answer.answer_boolean,
        selected_option_id: answer.selected_option_id,
        json_value: answer.json_value as any,
      });

      await this.answerRepo.save(entity);
    }

    return this.findOne(response.id);
  }

  private computeDurationSeconds(startedAt: Date): number {
    const diffMs = Date.now() - new Date(startedAt).getTime();
    return Math.max(0, Math.floor(diffMs / 1000));
  }
}
