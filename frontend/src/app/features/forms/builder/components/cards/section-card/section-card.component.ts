import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Question } from '../../../../models/question.model';


@Component({

  selector:'app-section-card',

  standalone:true,

  imports:[
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],

  templateUrl:'./section-card.component.html',

  styleUrl:'./section-card.component.scss'

})
export class SectionCardComponent {


  @Input()
  Question!: Question;



  @Output()
  duplicate =
    new EventEmitter<string>();



  @Output()
  remove =
    new EventEmitter<string>();



  @Output()
  selected =
    new EventEmitter<string>();





  selectQuestion():void {

    this.selected.emit(
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