import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';

import { Template } from '../models/template.model';


@Injectable({
    providedIn: 'root'
})
export class TemplateService {


    private readonly endpoint = '/forms/templates';



    constructor(
        private api: ApiService
    ){}





    create(
        data: Partial<Template>
    ): Observable<Template> {


        return this.api.post<Template>(
            this.endpoint,
            data
        );


    }








    findAll(): Observable<Template[]> {


        return this.api.get<Template[]>(
            this.endpoint
        );


    }








    findOne(
        id:string
    ): Observable<Template> {


        return this.api.get<Template>(
            `${this.endpoint}/${id}`
        );


    }








    update(
        id:string,
        data:Partial<Template>
    ): Observable<Template> {


        return this.api.patch<Template>(
            `${this.endpoint}/${id}`,
            data
        );


    }








    publish(
        id:string
    ): Observable<Template> {


        return this.api.post<Template>(
            `${this.endpoint}/${id}/publish`,
            {}
        );


    }








    archive(
        id:string
    ): Observable<Template> {


        return this.api.post<Template>(
            `${this.endpoint}/${id}/archive`,
            {}
        );


    }








    duplicate(
        id:string,
        data?:{
            title?:string;
            category?:string;
        }
    ): Observable<Template> {


        return this.api.post<Template>(
            `${this.endpoint}/${id}/duplicate`,
            data ?? {}
        );


    }


    play(
        id:string
    ):Observable<Template>{

        return this.findOne(id);

    }




    remove(
        id:string
    ): Observable<void> {


        return this.api.delete<void>(
            `${this.endpoint}/${id}`
        );


    }


}