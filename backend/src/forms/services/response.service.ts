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
import { FormQuestion } from '../entities/form-question.entity';
import { In } from 'typeorm';

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

@Injectable()
export class ResponseService {
  constructor(
    @InjectRepository(FormResponse)
    private readonly responseRepo: Repository<FormResponse>,
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
      assignment_id: input.assignment_id,
      user_id: input.user_id,
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
    const response = responses.find((item) => Boolean(item.submitted_at));
    const answers = response
      ? await this.answerRepo.find({ where: { response_id: response.id } })
      : [];
    const questions = answers.length
      ? await this.questionRepo.find({
          where: { id: In(answers.map((answer) => answer.question_id)) },
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
      questions: answers.map((answer) => ({
        id: answer.question_id,
        label: questionsById.get(answer.question_id)?.title ?? 'Question',
        type: questionsById.get(answer.question_id)?.type ?? 'text',
        userAnswer:
          answer.answer_text ??
          answer.answer_number ??
          answer.answer_boolean ??
          answer.json_value ??
          answer.selected_option_id ??
          '',
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

  async submit(input: SubmitResponseInput): Promise<FormResponse> {
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
