import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';

import { Result } from '../models/result.model';



@Injectable({
    providedIn:'root'
})
export class ResultService {



    private readonly endpoint = '/forms/results';





    constructor(
        private api:ApiService
    ){}





    evaluate(
        responseId:string,
        gradedBy?:string
    ):Observable<Result>{


        return this.api.post<Result>(
            `${this.endpoint}/${responseId}/evaluate`,
            gradedBy
                ? {
                    gradedBy
                }
                : {}
        );


    }








    findByResponse(
        responseId:string
    ):Observable<Result>{


        return this.api.get<Result>(
            `${this.endpoint}/${responseId}`
        );


    }








}