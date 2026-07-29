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
  selector: 'app-radio-Question-card',
  standalone: true,

  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],

  templateUrl: './radio-question-card.component.html',
  styleUrl: './radio-question-card.component.scss'
})
export class RadioQuestionCardComponent {


  @Input()
  Question!: Question;



  @Output()
  duplicate =
    new EventEmitter<string>();



  @Output()
  remove =
    new EventEmitter<string>();





  duplicateQuestion(event: MouseEvent): void {

    event.stopPropagation();

    this.duplicate.emit(
      this.Question.id
    );

  }






  deleteQuestion(event: MouseEvent): void {

    event.stopPropagation();

    this.remove.emit(
      this.Question.id
    );

  }


}