import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { Question } from '../../models/question.model';


@Injectable({
  providedIn:'root'
})
export class QuestionService {


private endpoint = '/forms/questions';



constructor(
 private api:ApiService
){}



createQuestion(
 data:Partial<Question>
){

 return this.api.post<Question>(
   this.endpoint,
   data
 );

}



updateQuestion(
 id:string,
 data:Partial<Question>
){

 return this.api.patch<Question>(
   `${this.endpoint}/${id}`,
   data
 );

}



deleteQuestion(
 id:string
){

 return this.api.delete<void>(
   `${this.endpoint}/${id}`
 );

}


}