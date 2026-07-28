import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Question } from '../../../../models/question.model';



@Component({

  selector: 'app-question-card',

  standalone:true,

  imports:[

    CommonModule,

    MatCardModule,

    MatIconModule,

    MatButtonModule

  ],

  templateUrl:'./question-card.component.html',

  styleUrl:'./question-card.component.scss'

})


export class QuestionCardComponent {


  @Input()
  question!: Question;



  @Input()
  selected = false;



  @Output()
  questionSelected =
    new EventEmitter<string>();



  @Output()
  duplicate =
    new EventEmitter<string>();



  @Output()
  remove =
    new EventEmitter<string>();





  select(){

    this.questionSelected.emit(
      this.question.id
    );

  }





  duplicateQuestion(event:MouseEvent){

    event.stopPropagation();


    this.duplicate.emit(
      this.question.id
    );

  }






  deleteQuestion(event:MouseEvent){

    event.stopPropagation();


    this.remove.emit(
      this.question.id
    );

  }



}