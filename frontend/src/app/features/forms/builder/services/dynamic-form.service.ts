import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { Template } from '../../models/template.model';
import { Question } from '../../models/question.model';



@Injectable({
  providedIn:'root'
})
export class DynamicFormService {


  constructor(
    private fb: FormBuilder
  ){}





  buildForm(
    template:Template
  ):FormGroup {


    const group:any = {};



  const questions: Question[] =
    template.questions ?? [];



    questions.forEach(
      (question:Question)=>{


        group[question.id] = [

          question.defaultValue ?? '',

          question.required
          ? Validators.required
          : []

        ];


      }
    );



    return this.fb.group(group);


  }






  updateValidators(
    question:Question,
    control:any,
    required:boolean
  ):void {


    if(required){

      control.addValidators(
        Validators.required
      );

    }
    else{

      control.clearValidators();

    }


    control.updateValueAndValidity({
      emitEvent:false
    });


  }


}