import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  AbstractControl
} from '@angular/forms';



import { BuilderService } from '../../../services/builder.service';
import { DynamicFormService } from '../../../services/dynamic-form.service';

import { PreviewRendererComponent } from '../preview-renderer/preview-renderer.component';

import { MatIconModule } from '@angular/material/icon';

import { QuestionType } from '../../../../models/question-type.enum';

import { ConditionEngineService }
from 'src/app/features/forms/services/engines/condition-engine.service';



@Component({
  selector:'app-question-preview',

  standalone:true,

  imports:[
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    PreviewRendererComponent
  ],

  templateUrl:'./question-preview.component.html',

  styleUrl:'./question-preview.component.scss'
})
export class QuestionPreviewComponent implements OnInit {


  form:FormGroup = new FormGroup({});


  QuestionType = QuestionType;



  constructor(

    public builder:BuilderService,

    private dynamicForm:DynamicFormService,

    public conditionEngine:ConditionEngineService

  ) {}







  ngOnInit():void {


    this.builder.template$

    .subscribe(template=>{


      if(!template){


        this.form =
          new FormGroup({});


        return;


      }





      this.form =
        this.dynamicForm.buildForm(
          template
        );





      /**
       * Premier calcul des conditions
       */
      this.applyConditions();






      /**
       * Recalcul automatique
       * après modification des valeurs
       */
      this.form.valueChanges

      .subscribe(()=>{


        this.applyConditions();


      });



    });


  }









  get visibleQuestions(){



    return this.builder.questions


    .filter(question=>{


      if(question.hidden){

        return false;

      }





      const state =

        this.conditionEngine.getQuestionState(

          question,

          this.form

        );





      return state.visible;



    })



    .sort(

      (a,b)=>

        a.order - b.order

    );



  }









  /**
   * Applique les actions des conditions
   *
   * SHOW
   * HIDE
   * ENABLE
   * DISABLE
   * REQUIRE
   * OPTIONAL
   */
  applyConditions():void {



    this.builder.questions.forEach(question=>{





      const control:

        AbstractControl | null =

        this.form.get(
          question.id
        );





      if(!control){

        return;

      }





      const state =

        this.conditionEngine.getQuestionState(

          question,

          this.form

        );








      /**
       * Désactivation dynamique
       */
      if(state.disabled){


        if(control.enabled){

          control.disable({

            emitEvent:false

          });

        }


      }

      else{


        if(control.disabled){

          control.enable({

            emitEvent:false

          });

        }


      }







      /**
       * Validation dynamique
       *
       * Required / Optional
       */
      this.dynamicForm.updateValidators(

          question,

          control,

          state.required

      );



    });



  }









  submit():void {



    if(this.form.invalid){


      this.form.markAllAsTouched();


      return;


    }





    console.log(

      'FORM RESULT',

      this.form.value

    );



  }









  getControl(
    id:string
  ):FormControl {



    const control =

      this.form.get(id);





    if(control instanceof FormControl){


      return control;


    }





    return new FormControl();



  }



}