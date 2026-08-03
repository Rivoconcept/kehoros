import { Injectable } from '@angular/core';

import {
  AbstractControl,
  FormControl
} from '@angular/forms';

import { Question } from '../models/question.model';

import { ValidationEngineService } from './engines/validation-engine.service';


@Injectable({
  providedIn:'root'
})
export class QuestionValidatorService {


  constructor(
    private validationEngine:ValidationEngineService
  ) {}





  validate(
    question:Question,
    value:any
  ):ValidationResult {



    const validators =
      this.validationEngine.buildValidators(

        this.extractRules(question)

      );





    const control =
      new FormControl(value);





    validators.forEach(
      validator=>{

        const error =
          validator(control);


        if(error){

          control.setErrors({

            ...control.errors,

            ...error

          });

        }

      }
    );





    if(control.errors){


      return {

        valid:false,

        message:
          this.getMessage(
            control.errors,
            question
          )

      };


    }





    return {

      valid:true

    };


  }









  private extractRules(
    question:Question
  ){


    const rules:any[] = [];





    if(question.required){

      rules.push({

        type:'REQUIRED',

        enabled:true,

        order:1

      });

    }





    if(question.minLength !== undefined){

      rules.push({

        type:'MIN_LENGTH',

        value:
          question.minLength,

        enabled:true

      });

    }






    if(question.maxLength !== undefined){

      rules.push({

        type:'MAX_LENGTH',

        value:
          question.maxLength,

        enabled:true

      });

    }






    if(question.minValue !== undefined){

      rules.push({

        type:'MIN_VALUE',

        value:
          question.minValue,

        enabled:true

      });

    }






    if(question.maxValue !== undefined){

      rules.push({

        type:'MAX_VALUE',

        value:
          question.maxValue,

        enabled:true

      });

    }






    if(question.pattern){

      rules.push({

        type:'REGEX',

        value:
          question.pattern,

        enabled:true

      });

    }






    if(question.validationRules?.length){


      rules.push(

        ...question.validationRules

      );


    }





    return rules;


  }









  private getMessage(
    errors:any,
    question:Question
  ):string {


    if(question.errorMessage){

      return question.errorMessage;

    }




    if(errors.required){

      return 'This field is required';

    }




    if(errors.minlength){

      return 'Minimum length not reached';

    }




    if(errors.maxlength){

      return 'Maximum length exceeded';

    }




    if(errors.min){

      return 'Value too small';

    }




    if(errors.max){

      return 'Value too large';

    }




    if(errors.regex){

      return 'Invalid format';

    }




    if(errors.email){

      return 'Invalid email';

    }




    return 'Invalid value';


  }



}






export interface ValidationResult {


  valid:boolean;


  message?:string;


}