import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Question } from '../../../../models/question.model';


@Component({
    selector: 'app-title-card',
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: './title-card.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrl: './title-card.component.scss'
})
export class TitleCardComponent {


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



  duplicateQuestion(event: MouseEvent): void {

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



  deleteQuestion(event: MouseEvent): void {

    event.stopPropagation();

    this.remove.emit(
      this.Question.id
    );

  }


}