import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Template } from '../models/template.model';
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
   * Liste des templates.
   */
  getTemplates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/templates`);
  }

  /**
   * Chargement d'un template.
   */
  getTemplateById(id: string): Observable<any> {
    return this.http.get<any>(`${this.api}/templates/${id}`);
  }

  /**
   * Création d'un template.
   */
  createTemplate(data: any): Observable<any> {
    return this.http.post<any>(`${this.api}/templates`, data);
  }

  /**
   * Modification d'un template.
   */
  updateTemplate(id: string, data: any): Observable<any> {
    return this.http.patch<any>(`${this.api}/templates/${id}`, data);
  }

  /**
   * Reordonnancement global des questions d'un template.
   *
   * Permet d'envoyer la liste des IDs ordonnés en une seule requête
   * et évite les erreurs 404 lors du Drag & Drop.
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
   * Création d'une question.
   *
   * Backend :
   * POST /forms/questions
   * Le template_id est envoyé dans le body.
   */
  createQuestion(data: CreateQuestionApiPayload): Observable<any> {
    return this.http.post<any>(`${this.api}/questions`, data);
  }

  /**
   * Modification d'une question.
   */
  updateQuestion(
    id: string,
    data: UpdateQuestionApiPayload
  ): Observable<any> {
    return this.http.patch<any>(`${this.api}/questions/${id}`, data);
  }

  /**
   * Suppression d'une question.
   */
  deleteQuestion(id: string): Observable<any> {
    return this.http.delete<any>(`${this.api}/questions/${id}`);
  }
}