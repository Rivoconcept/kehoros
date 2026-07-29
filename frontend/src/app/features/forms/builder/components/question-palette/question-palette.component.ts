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
      label: 'Question',
      icon: 'quiz'
    },

    {
      type: QuestionType.SECTION,
      label: 'Section',
      icon: 'view_agenda'
    },

    {
      type: QuestionType.TITLE,
      label: 'Title',
      icon: 'title'
    },

    {
      type: QuestionType.PARAGRAPH,
      label: 'Paragraph',
      icon: 'article'
    }

  ];

  addQuestion(type: QuestionType): void {

    this.questionAdded.emit(type);

  }

}