import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ReactiveFormsModule,
  FormGroup
} from '@angular/forms';


import { BuilderService } from '../../../services/builder.service';

import { MatIconModule } from '@angular/material/icon';


import { PreviewRendererComponent } from '../preview-renderer/preview-renderer.component';

import { DynamicFormService } from '../../../services/dynamic-form.service';

import { QuestionType } from '../../../../models/question-type.enum';



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



  form!:FormGroup;



  QuestionType = QuestionType;



  constructor(

    public builder:BuilderService,

    private dynamicForm:DynamicFormService

  ){}





  ngOnInit():void{


    this.builder.template$

      .subscribe(template=>{


        if(template){


          this.form =
            this.dynamicForm.buildForm(
              template
            );


        }


      });


  }







  get visibleQuestions(){


    return this.builder.questions

      .filter(

        question => !question.hidden

      )

      .sort(

        (a,b)=>a.order - b.order

      );


  }







  submit(){


    if(this.form.invalid){


      this.form.markAllAsTouched();


      return;


    }



    console.log(

      'FORM RESULT',

      this.form.value

    );


  }







  getControl(id:string){


    return this.form?.get(id) as any;


  }





}