import { Injectable } from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { BuilderStateService } from './builder-state.service';

@Injectable({
  providedIn: 'root'
})
export class BuilderSortService {

  constructor(private state: BuilderStateService) {}

  reorderQuestions(previousIndex: number, currentIndex: number): void {
    const currentTemplate = this.state.template;
    if (!currentTemplate || !currentTemplate.questions) return;

    const questionsCopy = [...currentTemplate.questions];
    moveItemInArray(questionsCopy, previousIndex, currentIndex);

    // Mettre à jour l'état centralisé
    this.state.updateQuestions(questionsCopy); // Adaptez selon le nom de la méthode dans votre StateService
  }
}