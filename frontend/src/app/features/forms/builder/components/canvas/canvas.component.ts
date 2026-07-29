import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  CdkDrag,
  CdkDropList,
  CdkDragDrop
} from '@angular/cdk/drag-drop';

import { BuilderService } from '../../services/builder.service';

import { QuestionType } from '../../../models/question-type.enum';

import { QuestionCardComponent } from '../canvas/question-card/question-card.component';
import { TitleCardComponent } from '../canvas/title-card/title-card.component';
import { SectionCardComponent } from '../canvas/section-card/section-card.component';
import { ParagraphCardComponent } from '../canvas/paragraph-card/paragraph-card.component';



@Component({

  selector:'app-canvas',

  standalone:true,

  imports:[

    CommonModule,

    CdkDropList,

    CdkDrag,

    QuestionCardComponent,

    TitleCardComponent,

    SectionCardComponent,

    ParagraphCardComponent

  ],

  templateUrl:'./canvas.component.html',

  styleUrl:'./canvas.component.scss'

})
export class CanvasComponent {


  QuestionType = QuestionType;



  constructor(
    public builder:BuilderService
  ){}





  drop(event:CdkDragDrop<any>):void {


    this.builder.reorderQuestions(

      event.previousIndex,

      event.currentIndex

    );


  }






  duplicateQuestion(id:string):void {


    this.builder.duplicateQuestion(id);


  }






  deleteQuestion(id:string):void {


    this.builder.removeQuestion(id);


  }


}