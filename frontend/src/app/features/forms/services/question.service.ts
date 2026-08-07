import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';

import { Question } from '../models/question.model';
import { QuestionOption } from '../models/question-option.model';



@Injectable({
  providedIn:'root'
})
export class QuestionService {


  private readonly optionEndpoint = '/forms/options';



  constructor(
    private api: ApiService
  ) {}



  /**
   * POST
   * /forms/templates/:templateId/questions
   */
  createQuestion(
    templateId:string,
    data:Partial<Question>
  ):Observable<Question>{


    return this.api.post<Question>(
      `/forms/templates/${templateId}/questions`,
      data
    );


  }




  /**
   * GET
   * /forms/templates/:templateId/questions
   */
  findByTemplate(
    templateId:string
  ):Observable<Question[]>{


    return this.api.get<Question[]>(
      `/forms/templates/${templateId}/questions`
    );


  }





  /**
   * GET
   * /forms/questions/:id
   */
  findOne(
    id:string
  ):Observable<Question>{


    return this.api.get<Question>(
      `/forms/questions/${id}`
    );


  }





  /**
   * PATCH
   * /forms/questions/:id
   */
  updateQuestion(
    id:string,
    data:Partial<Question>
  ):Observable<Question>{


    return this.api.patch<Question>(
      `/forms/questions/${id}`,
      data
    );


  }





  /**
   * DELETE
   * /forms/questions/:id
   */
  removeQuestion(
    id:string
  ):Observable<void>{


    return this.api.delete<void>(
      `/forms/questions/${id}`
    );


  }





  createOption(
    data:Partial<QuestionOption>
  ):Observable<QuestionOption>{


    return this.api.post<QuestionOption>(
      this.optionEndpoint,
      data
    );


  }





  updateOption(
    id:string,
    data:Partial<QuestionOption>
  ):Observable<QuestionOption>{


    return this.api.patch<QuestionOption>(
      `${this.optionEndpoint}/${id}`,
      data
    );


  }





  removeOption(
    id:string
  ):Observable<void>{


    return this.api.delete<void>(
      `${this.optionEndpoint}/${id}`
    );


  }



}