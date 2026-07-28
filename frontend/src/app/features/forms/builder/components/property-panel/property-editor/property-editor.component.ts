import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Question } from '../../../../models/question.model';
import { QuestionType } from '../../../../models/question-type.enum';
import { OptionEditorComponent } from '../option-editor/option-editor.component';

@Component({
  selector: 'app-property-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    OptionEditorComponent
  ],
  templateUrl: './property-editor.component.html',
  styleUrl: './property-editor.component.scss',
})
export class PropertyEditorComponent {

  @Input() question!: Question;
  @Output() questionChange = new EventEmitter<Question>();

  QuestionType = QuestionType;

  update() {
    this.questionChange.emit(this.question);
  }
}