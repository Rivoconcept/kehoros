import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';

import { QuestionType } from '../../../models/question-type.enum';


@Component({
  selector: 'app-question-palette',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './question-palette.component.html',
  styleUrl: './question-palette.component.scss'
})
export class QuestionPaletteComponent {


  @Output()
  questionAdded = new EventEmitter<QuestionType>();


  questionTypes = [

    {
      type: QuestionType.TEXT,
      label: 'Texte court',
      icon: 'short_text'
    },

    {
      type: QuestionType.TEXTAREA,
      label: 'Texte long',
      icon: 'notes'
    },

    {
      type: QuestionType.RADIO,
      label: 'Choix unique',
      icon: 'radio_button_checked'
    },

    {
      type: QuestionType.CHECKBOX,
      label: 'Choix multiple',
      icon: 'check_box'
    },

    {
      type: QuestionType.SELECT,
      label: 'Liste déroulante',
      icon: 'arrow_drop_down_circle'
    }

  ];


  addQuestion(type: QuestionType): void {

    this.questionAdded.emit(type);

  }


}