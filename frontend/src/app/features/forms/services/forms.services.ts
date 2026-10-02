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
  private apiUrl = 'http://localhost:3000/forms';

  constructor(private http: HttpClient) {}

  /**
   * List of templates.
   */
  getTemplates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/templates`);
  }

  /**
   * Load template by ID.
   */
  getTemplateById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/templates/${id}`);
  }

  /**
   * Create template.
   */
  createTemplate(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/templates`, data);
  }

  /**
   * Update template.
   */
  updateTemplate(id: string, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/templates/${id}`, data);
  }

  /**
   * Publish template.
   */
  publishTemplate(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/templates/${id}/publish`, {});
  }

  /**
   * Duplicate template.
   */
  duplicateTemplate(id: string, data?: { title?: string; category?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/templates/${id}/duplicate`, data ?? {});
  }

  /**
   * Archive template.
   */
  archiveTemplate(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/templates/${id}/archive`, {});
  }

  /**
   * Delete template.
   */
  deleteTemplate(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/templates/${id}`);
  }

  /**
   * Global reordering of questions.
   */
  reorderQuestions(
    templateId: string,
    questionOrders: { id: string; order: number }[]
  ): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/templates/${templateId}/reorder-questions`,
      { questions: questionOrders }
    );
  }

  /**
   * Create question.
   */
  createQuestion(data: CreateQuestionApiPayload): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/questions`, data);
  }

  /**
   * Update question.
   */
  updateQuestion(
    id: string,
    data: UpdateQuestionApiPayload
  ): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/questions/${id}`, data);
  }

  /**
   * Delete question.
   */
  deleteQuestion(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/questions/${id}`);
  }

  /**
   * Restore template.
   */
  restoreTemplate(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/templates/${id}/restore`, {});
  }

  /**
   * Récupère toutes les assignations de formulaires
   */
  getAssignments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/assignments`);
  }

  getAssignmentResult(assignmentId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/assignments/${assignmentId}/result`);
  }

  createAssignment(data: {
    template_id: string;
    assigned_by: string;
    target_type: string;
    user_ids?: string[];
    department_ids?: string[];
  }): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/assignments`, data);
  }

  /**
   * Annule / Supprime une assignation par son ID
   */
  cancelAssignment(assignmentId: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/assignments/${assignmentId}/cancel`, {});
  }

  /**
   * Envoie les réponses d'un utilisateur pour un formulaire
   */
  submitResponse(payload: { template_id?: string; assignment_id?: string; answers: Record<string, any> }): Observable<any> {
    // S'assurer d'appeler /responses/submit et non /responses
    return this.http.post(`${this.apiUrl}/responses/submit`, payload);
  }
}