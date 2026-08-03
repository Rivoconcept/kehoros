import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';

import { Question } from '../models/question.model';
import { QuestionOption } from '../models/question-option.model';



@Injectable({
    providedIn:'root'
})
export class QuestionService {



    private readonly questionEndpoint = '/forms/Questions';

    private readonly optionEndpoint = '/forms/options';




    constructor(
        private api:ApiService
    ){}





    createQuestion(
        data:Partial<Question>
    ):Observable<Question>{


        return this.api.post<Question>(
            this.questionEndpoint,
            data
        );


    }








    findByTemplate(
        templateId:string
    ):Observable<Question[]>{


        return this.api.get<Question[]>(
            `/forms/templates/${templateId}/Questions`
        );


    }








    findOne(
        id:string
    ):Observable<Question>{


        return this.api.get<Question>(
            `${this.questionEndpoint}/${id}`
        );


    }








    updateQuestion(
        id:string,
        data:Partial<Question>
    ):Observable<Question>{


        return this.api.patch<Question>(
            `${this.questionEndpoint}/${id}`,
            data
        );


    }








    removeQuestion(
        id:string
    ):Observable<void>{


        return this.api.delete<void>(
            `${this.questionEndpoint}/${id}`
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