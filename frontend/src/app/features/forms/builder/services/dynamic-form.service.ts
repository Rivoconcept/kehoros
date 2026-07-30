import { Injectable } from '@angular/core';

import {
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { Template } from '../../models/template.model';
import { Question } from '../../models/question.model';
import { QuestionType } from '../../models/question-type.enum';



@Injectable({
  providedIn:'root'
})
export class DynamicFormService {



  buildForm(template:Template):FormGroup {


    const group:any = {};



    template.questions.forEach(
      (question:Question)=>{


        group[question.id] =
          this.createControl(question);


      }
    );



    return new FormGroup(group);


  }







  private createControl(question:Question):FormControl {



    const validators = [];



    if(question.required){

      validators.push(
        Validators.required
      );

    }







    switch(question.type){



      case QuestionType.TEXT:


      case QuestionType.TEXTAREA:


        if(question.minLength){

          validators.push(

            Validators.minLength(
              question.minLength
            )

          );

        }



        if(question.maxLength){

          validators.push(

            Validators.maxLength(
              question.maxLength
            )

          );

        }



        if(question.pattern){

          validators.push(

            Validators.pattern(
              question.pattern
            )

          );

        }


      break;







      case QuestionType.EMAIL:


        validators.push(

          Validators.email

        );


      break;







      case QuestionType.NUMBER:


        if(question.minValue !== undefined){

          validators.push(

            Validators.min(
              question.minValue
            )

          );

        }



        if(question.maxValue !== undefined){

          validators.push(

            Validators.max(
              question.maxValue
            )

          );

        }


      break;


    }






    return new FormControl(

      question.defaultValue ?? null,

      validators

    );



  }





}