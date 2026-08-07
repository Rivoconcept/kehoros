import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FormsService {


  private api = 'http://localhost:3000/forms';


  constructor(
    private http: HttpClient
  ) {}



  getTemplates(): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.api}/templates`
    );

  }



  getTemplateById(
    id: string
  ): Observable<any> {

    return this.http.get<any>(
      `${this.api}/templates/${id}`
    );

  }



  createTemplate(
    data: any
  ): Observable<any> {

    return this.http.post<any>(
      `${this.api}/templates`,
      data
    );

  }



  updateTemplate(
    id: string,
    data: any
  ): Observable<any> {

    return this.http.patch<any>(
      `${this.api}/templates/${id}`,
      data
    );

  }



  /**
   * Création question liée à un template
   *
   * Backend attendu :
   * POST /forms/templates/:templateId/questions
   */
  createQuestion(
    templateId: string,
    data: any
  ): Observable<any> {

    return this.http.post<any>(
      `${this.api}/templates/${templateId}/questions`,
      data
    );

  }



  /**
   * Modification question
   *
   * Backend attendu :
   * PATCH /forms/questions/:id
   */
  updateQuestion(
    id: string,
    data: any
  ): Observable<any> {

    return this.http.patch<any>(
      `${this.api}/questions/${id}`,
      data
    );

  }



  deleteQuestion(
    id: string
  ): Observable<any> {

    return this.http.delete<any>(
      `${this.api}/questions/${id}`
    );

  }



}