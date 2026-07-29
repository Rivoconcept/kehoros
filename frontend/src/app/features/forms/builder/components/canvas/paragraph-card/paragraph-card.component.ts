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
  selector: 'app-paragraph-card',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './paragraph-card.component.html',
  styleUrl: './paragraph-card.component.scss'
})
export class ParagraphCardComponent {


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


  duplicateQuestion(event:MouseEvent){

    event.stopPropagation();

    this.duplicate.emit(
      this.Question.id
    );

  }

  selectQuestion():void {

    this.selected.emit(
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