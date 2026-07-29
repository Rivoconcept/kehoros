import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FormAnswer } from '../entities/form-answer.entity';
import { FormQuestion } from '../entities/form-question.entity';
import { FormResponse } from '../entities/form-response.entity';
import { FormResult } from '../entities/form-result.entity';
import { ResultStatus } from '../enums/result-status.enum';

@Injectable()
export class ResultService {
  constructor(
    @InjectRepository(FormResult)
    private readonly resultRepo: Repository<FormResult>,
    @InjectRepository(FormResponse)
    private readonly responseRepo: Repository<FormResponse>,
    @InjectRepository(FormAnswer)
    private readonly answerRepo: Repository<FormAnswer>,
    @InjectRepository(FormQuestion)
    private readonly QuestionRepo: Repository<FormQuestion>,
  ) {}

  async evaluate(responseId: string, gradedBy?: string): Promise<FormResult> {
    const response = await this.responseRepo.findOne({ where: { id: responseId } });
    if (!response) {
      throw new NotFoundException(`Response with id ${responseId} not found`);
    }

    const answers = await this.answerRepo.find({ where: { response_id: response.id } });
    const Questions = await this.QuestionRepo.find();

    let score = 0;
    let maxScore = 0;

    for (const Question of Questions) {
      maxScore += Question.points ?? 0;
      const answer = answers.find((item) => item.question_id === Question.id);
      if (!answer) {
        continue;
      }

      if (Question.type === 'boolean' && answer.answer_boolean === true) {
        score += Question.points ?? 0;
      }

      if (Question.type === 'number' && answer.answer_number !== undefined) {
        score += Question.points ?? 0;
      }

      if ((Question.type === 'radio' || Question.type === 'select') && answer.selected_option_id) {
        score += Question.points ?? 0;
      }

      if ((Question.type === 'text' || Question.type === 'textarea') && answer.answer_text?.trim()) {
        score += Question.points ?? 0;
      }
    }

    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const status = percentage >= 50 ? ResultStatus.PASSED : ResultStatus.FAILED;

    const existing = await this.resultRepo.findOne({ where: { response_id: response.id } });

    if (existing) {
      await this.resultRepo.update(existing.id, {
        score,
        max_score: maxScore,
        percentage,
        status,
        graded_by: gradedBy,
        graded_at: new Date(),
      });
      return this.resultRepo.findOneOrFail({ where: { id: existing.id } });
    }

    const result = this.resultRepo.create({
      response_id: response.id,
      score,
      max_score: maxScore,
      percentage,
      status,
      graded_by: gradedBy,
      graded_at: new Date(),
    });

    return this.resultRepo.save(result);
  }

  async findByResponse(responseId: string): Promise<FormResult[]> {
    return this.resultRepo.find({ where: { response_id: responseId } });
  }

  async findOne(id: string): Promise<FormResult> {
    const result = await this.resultRepo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException(`Result with id ${id} not found`);
    }

    return result;
  }

  async updateStatus(id: string, status: ResultStatus): Promise<FormResult> {
    const result = await this.findOne(id);
    if (!Object.values(ResultStatus).includes(status)) {
      throw new BadRequestException('Invalid result status');
    }

    await this.resultRepo.update(id, { status });
    return this.findOne(id);
  }
}
