import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';

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


import { Template } from '../../../../models/template.model';



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
export class QuestionPreviewComponent implements OnInit, OnChanges {


  @Input()
  template?:Template;



  form:FormGroup = new FormGroup({});


  QuestionType = QuestionType;




  constructor(

    public builder:BuilderService,

    private dynamicForm:DynamicFormService,

    public conditionEngine:ConditionEngineService

  ) {}







  ngOnInit():void {


    /**
     * Mode Builder
     */
    if(!this.template){


      this.builder.template$

      .subscribe(template=>{


        if(template){

          this.loadTemplate(template);

        }


      });


    }


  }







  ngOnChanges(
    changes:SimpleChanges
  ):void {


    if(
      changes['template'] &&
      this.template
    ){


      this.loadTemplate(
        this.template
      );


    }


  }








  private loadTemplate(
    template:Template
  ):void {



    this.form =

      this.dynamicForm.buildForm(
        template
      );



    this.applyConditions();





    this.form.valueChanges

    .subscribe(()=>{


      this.applyConditions();


    });



  }








  get questions(){


    return this.template

      ? this.template.questions

      : this.builder.questions;


  }








  get visibleQuestions(){


    return this.questions


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









  applyConditions():void {



    this.questions.forEach(question=>{


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





      if(state.disabled){


        control.disable({

          emitEvent:false

        });


      }

      else{


        control.enable({

          emitEvent:false

        });


      }






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




    return control instanceof FormControl

      ? control

      : new FormControl();



  }


}