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

import { PreviewRendererComponent } from '../../preview-renderer/preview-renderer.component';



@Component({

  selector: 'app-Question-card',

  standalone:true,

  imports:[

    CommonModule,

    MatCardModule,

    MatIconModule,

    MatButtonModule,

    PreviewRendererComponent

  ],

  templateUrl:'./question-card.component.html',

  styleUrl:'./question-card.component.scss'

})


export class QuestionCardComponent {


  @Input()
  Question!: Question;



  @Input()
  selected = false;



  @Output()
  QuestionSelected =
    new EventEmitter<string>();



  @Output()
  duplicate =
    new EventEmitter<string>();



  @Output()
  remove =
    new EventEmitter<string>();





  select(){

    this.QuestionSelected.emit(
      this.Question.id
    );

  }





  duplicateQuestion(event:MouseEvent){

    event.stopPropagation();


    this.duplicate.emit(
      this.Question.id
    );

  }






  deleteQuestion(event:MouseEvent){

    event.stopPropagation();


    this.remove.emit(
      this.Question.id
    );

  }



}