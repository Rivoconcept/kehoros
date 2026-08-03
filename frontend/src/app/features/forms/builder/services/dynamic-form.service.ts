import { Injectable } from '@angular/core';

import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ValidationEngineService } from '../../services/engines/validation-engine.service';
import { Template } from '../../models/template.model';
import { Question } from '../../models/question.model';
import { QuestionType } from '../../models/question-type.enum';



@Injectable({
  providedIn:'root'
})
export class DynamicFormService {



  constructor(
    private validationEngine:ValidationEngineService
  ){}





  buildForm(
    template:Template
  ):FormGroup {


    const group:any = {};



    template.questions.forEach(

      (question:Question)=>{


        group[question.id] =

          this.createControl(question);


      }

    );



    return new FormGroup(group);


  }









  private createControl(
    question:Question
  ):FormControl {



    const validators:ValidatorFn[] = [];





    /**
     * Anciennes validations
     * Compatibilité avec les anciens formulaires
     */

    if(question.required){

      validators.push(
        Validators.required
      );

    }






    if(question.minLength !== undefined){

      validators.push(

        Validators.minLength(
          question.minLength
        )

      );

    }






    if(question.maxLength !== undefined){

      validators.push(

        Validators.maxLength(
          question.maxLength
        )

      );

    }






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






    if(question.pattern){

      validators.push(

        Validators.pattern(
          question.pattern
        )

      );

    }









    /**
     * Validation selon le type
     */

    switch(question.type){



      case QuestionType.EMAIL:


        validators.push(
          Validators.email
        );


      break;





      case QuestionType.PHONE:


        if(!question.validationRules?.some(
          r=>r.type === 'PHONE'
        )){

          validators.push(
            Validators.pattern(
              /^[+]?[0-9\s\-().]{7,20}$/
            )
          );

        }


      break;






      default:

        break;


    }









    /**
     * Nouvelles validations dynamiques
     */

    if(question.validationRules?.length){


      validators.push(

        ...this.validationEngine.buildValidators(

          question.validationRules

        )

      );


    }




    const control = new FormControl(
      question.defaultValue ?? null,
      validators
    );


    if(question.disabled){

      control.disable({
        emitEvent:false
      });

    }


    return control;


  }

  updateValidators(
      question: Question,
      control: AbstractControl,
      required: boolean
  ): void {


    const validators:ValidatorFn[] = [];



    if(required){

        validators.push(
            Validators.required
        );

    }



    if(question.minLength !== undefined){

        validators.push(
            Validators.minLength(
                question.minLength
            )
        );

    }



    if(question.maxLength !== undefined){

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



    control.setValidators(
        validators
    );


    control.updateValueAndValidity({
        emitEvent:false
    });


}



}