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

import { Condition } from '../../../../models/condition.model';

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
    public builder:BuilderService
  ){}





  readonly responseTypes = [

    { value: QuestionType.TEXT, label:'Short text' },

    { value: QuestionType.TEXTAREA, label:'Long text' },

    { value: QuestionType.NUMBER, label:'Number' },

    { value: QuestionType.EMAIL, label:'Email' },

    { value: QuestionType.PHONE, label:'Phone' },

    { value: QuestionType.DATE, label:'Date' },

    { value: QuestionType.TIME, label:'Time' },

    { value: QuestionType.DATETIME, label:'Date Time' },

    { value: QuestionType.SELECT, label:'Dropdown' },

    { value: QuestionType.RADIO, label:'Single choice' },

    { value: QuestionType.CHECKBOX, label:'Multiple choice' },

    { value: QuestionType.SWITCH, label:'Toggle' },

    { value:QuestionType.FILE,label:'File' },

    { value:QuestionType.IMAGE,label:'Image' },

    { value:QuestionType.SIGNATURE,label:'Signature' },

    { value:QuestionType.RATING,label:'Rating' },

    { value:QuestionType.SCALE,label:'Scale' },

    { value:QuestionType.QR,label:'QR Code' },

    { value:QuestionType.BARCODE,label:'Barcode' }

  ];





  readonly operators = [

    {value:'==',label:'Equal'},

    {value:'!=',label:'Different'},

    {value:'>',label:'Greater than'},

    {value:'<',label:'Less than'},

    {value:'>=',label:'Greater or equal'},

    {value:'<=',label:'Less or equal'},

    {value:'contains',label:'Contains'},

    {value:'startsWith',label:'Starts with'},

    {value:'endsWith',label:'Ends with'},

    {value:'empty',label:'Empty'},

    {value:'notEmpty',label:'Not empty'}

  ];





  readonly conditionActions = [

    {value:'SHOW',label:'Show'},

    {value:'HIDE',label:'Hide'},

    {value:'ENABLE',label:'Enable'},

    {value:'DISABLE',label:'Disable'},

    {value:'REQUIRE',label:'Required'},

    {value:'OPTIONAL',label:'Optional'}

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







  get availableQuestions():Question[] {


    return this.builder.questions.filter(

      q=>q.id !== this.Question.id

    );


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

      updated.options.length===0

    ){


      updated.options=[

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









    addConditionGroup():void {


      if(!this.Question.conditionGroups){

        this.Question.conditionGroups=[];

      }



      this.Question.conditionGroups.push({

        id: crypto.randomUUID(),

        operator:'AND',

        conditions:[

          this.createCondition()

        ]

      });



      this.update();


    }








  removeConditionGroup(index:number):void {


    this.Question.conditionGroups?.splice(

      index,

      1

    );


    this.update();


  }








  addCondition(index:number):void {


    const group =

      this.Question.conditionGroups?.[index];



    if(!group){

      return;

    }



    group.conditions.push(

      this.createCondition()

    );


    this.update();


  }








  removeCondition(
    groupIndex:number,
    conditionIndex:number
  ):void {


    const group =

      this.Question.conditionGroups?.[groupIndex];



    if(!group){

      return;

    }



    group.conditions.splice(

      conditionIndex,

      1

    );


    this.update();


  }









  private createCondition():Condition {


    return {


      id:crypto.randomUUID(),


      sourceQuestionId:'',


      operator:'==',


      expectedValue:'',


      action:'SHOW',


      enabled:true


    };


  }








  update():void {


    this.QuestionChange.emit({

      ...this.Question,

      options:[

        ...this.Question.options

      ],


      conditionGroups:

        this.Question.conditionGroups

          ? [...this.Question.conditionGroups]

          : []


    });


  }



}