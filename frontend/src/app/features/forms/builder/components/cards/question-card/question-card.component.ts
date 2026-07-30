import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Question } from '../../../../models/question.model';

import { PreviewRendererComponent } from '../../preview/preview-renderer/preview-renderer.component';


@Component({

  selector:'app-question-card',

  standalone:true,

  imports:[

    CommonModule,

    MatIconModule,

    MatButtonModule,

    PreviewRendererComponent

  ],

  templateUrl:'./question-card.component.html',

  styleUrl:'./question-card.component.scss'

})
export class QuestionCardComponent {


  @Input()
  Question!:Question;



  @Input()
  selected=false;



  @Output()
  QuestionSelected =
    new EventEmitter<string>();



  @Output()
  duplicate =
    new EventEmitter<string>();



  @Output()
  remove =
    new EventEmitter<string>();






  select():void {

    this.QuestionSelected.emit(
      this.Question.id
    );

  }






  duplicateQuestion(event:MouseEvent):void {


    event.stopPropagation();


    this.duplicate.emit(
      this.Question.id
    );


  }






  deleteQuestion(event:MouseEvent):void {


    event.stopPropagation();


    this.remove.emit(
      this.Question.id
    );


  }


}