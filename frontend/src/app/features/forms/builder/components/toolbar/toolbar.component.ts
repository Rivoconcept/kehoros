import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { QuestionPaletteComponent } from '../question-palette/question-palette.component';
import { BuilderService } from '../../services/builder.service';
import { QuestionType } from '../../../models/question-type.enum';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    QuestionPaletteComponent
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  @Input() title: string = '';
  @Output() titleChange = new EventEmitter<string>();
  @Output() saveForm = new EventEmitter<void>();

  showFieldMenu = false;

  constructor(public builder: BuilderService) {}

  toggleFieldMenu(): void {
    this.showFieldMenu = !this.showFieldMenu;
  }

  closeFieldMenu(): void {
    this.showFieldMenu = false;
  }

  addQuestion(type: QuestionType): void {
    this.builder.addQuestion(type);
    this.closeFieldMenu();
  }

  save(): void {
    this.saveForm.emit();
    this.builder.save();
  }

  export(): void {
    this.builder.exportTemplate();
  }

  import(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.builder.importTemplate(input.files[0]);
    }
  }

  // Remise à zéro rapide du formulaire sans ouvrir de modal
  newTemplate(): void {
    this.builder.createTemplate({
      title: 'New Questionnaire',
      description: '',
      category: 'general'
    });
  }

  onTitleChange(): void {
    this.titleChange.emit(this.title);
  }
}