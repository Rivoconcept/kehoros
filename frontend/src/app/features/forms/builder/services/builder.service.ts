import { Injectable } from '@angular/core';

import { BuilderStateService } 
from './builder/builder-state.service';

import { BuilderTemplateService } 
from './builder/builder-template.service';

import { BuilderQuestionService } 
from './builder/builder-question.service';

import { BuilderSortService } 
from './builder/builder-sort.service';

import { BuilderFileService } 
from './builder/builder-file.service';


import { Question } 
from '../../models/question.model';

import { QuestionType } 
from '../../models/question-type.enum';

import { Template } 
from '../../models/template.model';



@Injectable({
  providedIn:'root'
})
export class BuilderService {


  constructor(

    private state: BuilderStateService,

    private templateService: BuilderTemplateService,

    private questionService: BuilderQuestionService,

    private sortService: BuilderSortService,

    private fileService: BuilderFileService

  ){}



  template$ =
    this.state.template$;



  selectedQuestion$ =
    this.state.selectedQuestion$;




  get template():Template|null {

    return this.state.template;

  }





  get questions():Question[] {

    return this.state.questions;

  }





  get visibleQuestions():Question[] {

    return this.state.visibleQuestions;

  }





  loadTemplate(
    id:string
  ):void {

    this.templateService.loadTemplate(id);

  }





  /**
   * Création locale uniquement.
   * Aucun appel API.
   * Le POST sera fait uniquement au Save.
   */
    createTemplate(
    data:{
      title:string;
      description?:string;
      category?:string;
    }
    ):void {

      this.templateService.createTemplateLocal(
        data
      );

    }




    createTemplateLocal(
      data:{
        title:string;
        description?:string;
        category?:string;
      }
    ):void {

      this.templateService.createTemplateLocal(data);

    }





  save(
    template?:Template
  ):void {


    this.templateService.saveTemplate(
      template
    );


  }





  addQuestion(type: QuestionType): void {
     console.log(
   'BuilderService addQuestion',
   type
 );
    this.questionService.addQuestion(type);
  }





  updateQuestion(
    question:Question
  ):void {

    this.questionService.updateQuestion(question);

  }





  duplicateQuestion(
    id:string
  ):void {

    this.questionService.duplicateQuestion(id);

  }





  removeQuestion(
    id:string
  ):void {

    this.questionService.removeQuestion(id);

  }





  reorderQuestions(
    previousIndex:number,
    currentIndex:number
  ):void {

    this.sortService.reorderQuestions(
      previousIndex,
      currentIndex
    );

  }





  exportTemplate():void {

    this.fileService.exportTemplate();

  }





  importTemplate(
    file:File
  ):void {

    this.fileService.importTemplate(file);

  }





  selectQuestion(
    id:string
  ):void {

    this.state.selectQuestion(id);

  }





  getSelectedQuestion():Question|null {

    return this.state.getSelectedQuestion();

  }


}