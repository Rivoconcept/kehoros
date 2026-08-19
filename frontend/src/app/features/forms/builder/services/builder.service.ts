import { Injectable } from "@angular/core";
import { QuestionType } from "../../models/question-type.enum";
import { Question } from "../../models/question.model";
import { Template } from "../../models/template.model";
import { BuilderFileService } from "./builder/builder-file.service";
import { BuilderQuestionService } from "./builder/builder-question/builder-question.service";
import { BuilderSortService } from "./builder/builder-sort.service";
import { BuilderStateService } from "./builder/builder-state.service";
import { BuilderTemplateService } from "./builder/builder-template/builder-template.service";

@Injectable({
  providedIn: 'root'
})
export class BuilderService {

  constructor(
    private state: BuilderStateService,
    private templateService: BuilderTemplateService,
    private questionService: BuilderQuestionService,
    private sortService: BuilderSortService,
    private fileService: BuilderFileService
  ) {}

  template$ = this.state.template$;
  selectedQuestion$ = this.state.selectedQuestion$;

  get template(): Template | null {
    return this.state.template;
  }

  get questions(): Question[] {
    return this.state.questions;
  }

  get visibleQuestions(): Question[] {
    return this.state.visibleQuestions;
  }

  loadTemplate(id: string): void {
    this.templateService.loadTemplate(id);
  }

  createTemplate(data: { title: string; description?: string; category?: string }): void {
    this.templateService.createTemplateLocal(data);
  }

  createTemplateLocal(data: { title: string; description?: string; category?: string }): void {
    this.templateService.createTemplateLocal(data);
  }

  save(template?: Template): void {
    this.templateService.saveTemplate(template);
  }

  addQuestion(type: QuestionType): void {
    console.log('BuilderService addQuestion', type);
    this.questionService.addQuestion(type);
  }

  addQuestionAtIndex(type: QuestionType, index: number): void {
    const qService = this.questionService as any;
    if (typeof qService.addQuestionAtIndex === 'function') {
      qService.addQuestionAtIndex(type, index);
    } else {
      this.questionService.addQuestion(type);
    }
  }

  reorderQuestions(previousIndex: number, currentIndex: number): void {
    const sService = this.sortService as any;
    const qService = this.questionService as any;

    if (typeof sService.reorderQuestions === 'function') {
      sService.reorderQuestions(previousIndex, currentIndex);
    } else if (typeof qService.reorderQuestions === 'function') {
      qService.reorderQuestions(previousIndex, currentIndex);
    }
  }

  updateQuestion(question: Question): void {
    this.questionService.updateQuestion(question);
  }

  duplicateQuestion(id: string): void {
    this.questionService.duplicateQuestion(id);
  }

  removeQuestion(id: string): void {
    this.questionService.removeQuestion(id);
  }

  exportTemplate(): void {
    this.fileService.exportTemplate();
  }

  importTemplate(file: File): void {
    this.fileService.importTemplate(file);
  }

  selectQuestion(id: string): void {
    this.state.selectQuestion(id);
  }

  getSelectedQuestion(): Question | null {
    return this.state.getSelectedQuestion();
  }
}