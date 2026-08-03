import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';

import { Assignment } from '../models/assignment.model';



@Injectable({
    providedIn:'root'
})
export class AssignmentService {



    private readonly endpoint = '/forms/assignments';




    constructor(
        private api:ApiService
    ){}





    assign(
        data:Partial<Assignment>
    ):Observable<Assignment>{


        return this.api.post<Assignment>(
            this.endpoint,
            data
        );


    }








    findAll():Observable<Assignment[]>{


        return this.api.get<Assignment[]>(
            this.endpoint
        );


    }








    findByUser(
        userId:string
    ):Observable<Assignment[]>{


        return this.api.get<Assignment[]>(
            `${this.endpoint}?userId=${userId}`
        );


    }








    findByTemplate(
        templateId:string
    ):Observable<Assignment[]>{


        return this.api.get<Assignment[]>(
            `${this.endpoint}?templateId=${templateId}`
        );


    }








    updateStatus(
        id:string,
        status:string
    ):Observable<Assignment>{


        return this.api.patch<Assignment>(
            `${this.endpoint}/${id}/status`,
            {
                status
            }
        );


    }


}