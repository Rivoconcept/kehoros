import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';

import { Response } from '../models/response.model';



@Injectable({
    providedIn:'root'
})
export class ResponseService {



    private readonly endpoint = '/forms/responses';





    constructor(
        private api:ApiService
    ){}





    start(
        data:Partial<Response>
    ):Observable<Response>{


        return this.api.post<Response>(
            `${this.endpoint}/start`,
            data
        );


    }








    saveDraft(
        data:Partial<Response>
    ):Observable<Response>{


        return this.api.post<Response>(
            `${this.endpoint}/draft`,
            data
        );


    }








    submit(
        data:Partial<Response>
    ):Observable<Response>{


        return this.api.post<Response>(
            `${this.endpoint}/submit`,
            data
        );


    }








    findByAssignment(
        assignmentId:string
    ):Observable<Response[]>{


        return this.api.get<Response[]>(
            `${this.endpoint}/${assignmentId}`
        );


    }



}