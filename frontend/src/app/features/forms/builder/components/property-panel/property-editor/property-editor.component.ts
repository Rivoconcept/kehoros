import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Question } from '../../../../models/question.model';
import { QuestionType } from '../../../../models/question-type.enum';

import { OptionEditorComponent } from '../option-editor/option-editor.component';

import { BuilderService } from '../../../services/builder.service';



@Component({

  selector:'app-property-editor',

  standalone:true,

  imports:[

    CommonModule,

    FormsModule,

    MatFormFieldModule,

    MatInputModule,

    MatSelectModule,

    MatSlideToggleModule,

    MatIconModule,

    MatButtonModule,

    OptionEditorComponent

  ],

  templateUrl:'./property-editor.component.html',

  styleUrl:'./property-editor.component.scss'

})
export class PropertyEditorComponent {


  @Input()
  Question!: Question;



  @Output()
  QuestionChange =
    new EventEmitter<Question>();



  QuestionType = QuestionType;



  constructor(
    public builder: BuilderService
  ) {}





  readonly responseTypes = [

    { value: QuestionType.TEXT, label:'Short text' },

    { value: QuestionType.TEXTAREA, label:'Long text' },

    { value: QuestionType.NUMBER, label:'Number' },

    { value: QuestionType.EMAIL, label:'Email' },

    { value: QuestionType.PHONE, label:'Phone' },

    { value: QuestionType.DATE, label:'Date' },

    { value: QuestionType.TIME, label:'Time' },

    { value: QuestionType.DATETIME, label:'Date et Time' },

    { value: QuestionType.SELECT, label:'Dropdown' },

    { value: QuestionType.RADIO, label:'Single choice' },

    { value: QuestionType.CHECKBOX, label:'Multiple choice' },

    { value: QuestionType.SWITCH, label:'Toggle' },

    { value: QuestionType.FILE, label:'File' },

    { value: QuestionType.IMAGE, label:'Image' },

    { value: QuestionType.SIGNATURE, label:'Signature' },

    { value: QuestionType.RATING, label:'Rating' },

    { value: QuestionType.SCALE, label:'Scale' },

    { value: QuestionType.QR, label:'QR Code' },

    { value: QuestionType.BARCODE, label:'Barcode' }

  ];





  readonly widthOptions = [

    { value:'25%', label:'25%' },

    { value:'33%', label:'33%' },

    { value:'50%', label:'50%' },

    { value:'66%', label:'66%' },

    { value:'75%', label:'75%' },

    { value:'100%', label:'100%' }

  ];





  readonly scaleSteps = [

    1,
    2,
    5,
    10,
    20

  ];






  get isQuestion():boolean {


    if(!this.Question){

      return false;

    }


    return ![

      QuestionType.TITLE,

      QuestionType.SECTION,

      QuestionType.PARAGRAPH

    ].includes(this.Question.type);

  }







  /**
   * Questions utilisables pour les conditions
   * Exclut la question actuelle
   */
  get availableQuestions(): Question[] {


    return this.builder.questions.filter(

      q => q.id !== this.Question.id

    );


  }





  /**
   * Question sélectionnée comme dépendance
   */
  get conditionQuestion(): Question | undefined {


    return this.builder.questions.find(

      q => q.id === this.Question.dependsOnQuestionId

    );


  }







  /**
   * Valeurs disponibles pour la condition
   */
  get conditionValues(): string[] {


    const question = this.conditionQuestion;


    if(!question){

      return [];

    }


    if(

      question.type === QuestionType.RADIO ||

      question.type === QuestionType.CHECKBOX ||

      question.type === QuestionType.SELECT

    ){

      return question.options.map(

        option => option.value

      );

    }


    return [];

  }








  changeType(type:QuestionType):void {


    const updated:Question = {

      ...this.Question,

      type,

      options:[

        ...this.Question.options

      ]

    };



    const needsOptions = [

      QuestionType.RADIO,

      QuestionType.CHECKBOX,

      QuestionType.SELECT

    ].includes(type);





    if(

      needsOptions &&

      updated.options.length === 0

    ){

      updated.options = [


        {

          id:crypto.randomUUID(),

          label:'Option 1',

          value:'option-1',

          order:0

        },


        {

          id:crypto.randomUUID(),

          label:'Option 2',

          value:'option-2',

          order:1

        }


      ];

    }



    this.QuestionChange.emit(updated);


  }








  updateCondition():void {


    this.QuestionChange.emit({

      ...this.Question,

      conditional:

        this.Question.conditional ?? false


    });


  }








  update():void {


    this.QuestionChange.emit({

      ...this.Question,

      options:[

        ...this.Question.options

      ]

    });


  }



}