import { Injectable } from '@angular/core';

import { ApiService } from 'src/app/core/services/api.service';
import { QuestionType } from '../models/question-type.enum';
import { Question } from '../models/question.model';



export interface CreateQuestionApiPayload {
  template_id: string;

  title: string;

  description?: string;

  type: QuestionType;

  required?: boolean;

  position?: number;

  points?: number;

  settings?: Record<string, any>;
}

export interface UpdateQuestionApiPayload {
  title?: string;

  description?: string;

  type?: QuestionType;

  required?: boolean;

  position?: number;

  points?: number;

  settings?: Record<string, any>;
}

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private endpoint = '/forms/questions';

  constructor(
    private api: ApiService,
  ) {}

  /**
   * Création d'une question.
   *
   * Endpoint backend :
   *
   * POST /forms/questions
   */
  createQuestion(
    data: CreateQuestionApiPayload,
  ) {
    return this.api.post<Question>(
      this.endpoint,
      data,
    );
  }

  /**
   * Modification d'une question.
   *
   * Endpoint backend :
   *
   * PATCH /forms/questions/:id
   */
  updateQuestion(
    id: string,
    data: UpdateQuestionApiPayload,
  ) {
    return this.api.patch<Question>(
      `${this.endpoint}/${id}`,
      data,
    );
  }

  /**
   * Suppression d'une question.
   */
  deleteQuestion(
    id: string,
  ) {
    return this.api.delete<void>(
      `${this.endpoint}/${id}`,
    );
  }
}