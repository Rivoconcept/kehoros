import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  CdkDrag,
  CdkDropList,
  CdkDragDrop
} from '@angular/cdk/drag-drop';


import { QuestionType } from '../../../models/question-type.enum';
import { Question } from '../../../models/question.model';


import { QuestionCardComponent } from '../cards/question-card/question-card.component';
import { TitleCardComponent } from '../cards/title-card/title-card.component';
import { SectionCardComponent } from '../cards/section-card/section-card.component';
import { ParagraphCardComponent } from '../cards/paragraph-card/paragraph-card.component';
import { BuilderService } from '../../services/builder.service';



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





  drop(event: CdkDragDrop<Question[]>): void {
    // CAS 1 : Déplacement/réordonnancement au sein du Canvas uniquement
    if (event.previousContainer === event.container) {
      this.builder.reorderQuestions(
        event.previousIndex,
        event.currentIndex
      );
    } 
    // CAS 2 : Glisser-déposer depuis la palette vers le Canvas
    else {
      const questionType = event.item.data as QuestionType;
      this.builder.addQuestionAtIndex(questionType, event.currentIndex);
    }
  }






  duplicateQuestion(id:string):void {


    this.builder.duplicateQuestion(id);


  }






  deleteQuestion(id:string):void {


    this.builder.removeQuestion(id);


  }



}