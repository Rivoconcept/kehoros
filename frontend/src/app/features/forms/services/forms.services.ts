import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  CreateQuestionApiPayload,
  UpdateQuestionApiPayload,
} from './question.service';

@Injectable({
  providedIn: 'root',
})
export class FormsService {
  private api = 'http://localhost:3000/forms';

  constructor(private http: HttpClient) {}

  /**
   * List of templates.
   */
  getTemplates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/templates`);
  }

  /**
   * Load template by ID.
   */
  getTemplateById(id: string): Observable<any> {
    return this.http.get<any>(`${this.api}/templates/${id}`);
  }

  /**
   * Create template.
   */
  createTemplate(data: any): Observable<any> {
    return this.http.post<any>(`${this.api}/templates`, data);
  }

  /**
   * Update template.
   */
  updateTemplate(id: string, data: any): Observable<any> {
    return this.http.patch<any>(`${this.api}/templates/${id}`, data);
  }

  /**
   * Publish template.
   */
  publishTemplate(id: string): Observable<any> {
    return this.http.post<any>(`${this.api}/templates/${id}/publish`, {});
  }

  /**
   * Duplicate template.
   */
  duplicateTemplate(id: string, data?: { title?: string; category?: string }): Observable<any> {
    return this.http.post<any>(`${this.api}/templates/${id}/duplicate`, data ?? {});
  }

  /**
   * Archive template.
   */
  archiveTemplate(id: string): Observable<any> {
    return this.http.post<any>(`${this.api}/templates/${id}/archive`, {});
  }

  /**
   * Delete template.
   */
  deleteTemplate(id: string): Observable<any> {
    return this.http.delete<any>(`${this.api}/templates/${id}`);
  }

  /**
   * Global reordering of questions.
   */
  reorderQuestions(
    templateId: string,
    questionOrders: { id: string; order: number }[]
  ): Observable<any> {
    return this.http.patch<any>(
      `${this.api}/templates/${templateId}/reorder-questions`,
      { questions: questionOrders }
    );
  }

  /**
   * Create question.
   */
  createQuestion(data: CreateQuestionApiPayload): Observable<any> {
    return this.http.post<any>(`${this.api}/questions`, data);
  }

  /**
   * Update question.
   */
  updateQuestion(
    id: string,
    data: UpdateQuestionApiPayload
  ): Observable<any> {
    return this.http.patch<any>(`${this.api}/questions/${id}`, data);
  }

  /**
   * Delete question.
   */
  deleteQuestion(id: string): Observable<any> {
    return this.http.delete<any>(`${this.api}/questions/${id}`);
  }

  /**
   * Restore template.
   */
  restoreTemplate(id: string): Observable<any> {
    return this.http.post<any>(`${this.api}/templates/${id}/restore`, {});
  }
}