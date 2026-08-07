import { Injectable } from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';

import { BuilderStateService } from './builder-state.service';
import { BuilderTemplateService } from './builder-template.service';



@Injectable({
  providedIn: 'root'
})
export class BuilderSortService {


  constructor(
    private state: BuilderStateService,
    private templateService: BuilderTemplateService
  ) {}





  reorderQuestions(
    previousIndex:number,
    currentIndex:number
  ):void {


    const template =
      this.state.template;



    if(!template)
      return;




    const selected =
      this.state.getSelectedQuestion();




    moveItemInArray(

      template.questions,

      previousIndex,

      currentIndex

    );





    template.questions.forEach(
      (question,index)=>{

        question.order = index;

      }
    );





    this.state.setTemplate(
      template
    );





    if(selected){

      this.state.selectQuestion(
        selected.id
      );

    }





    this.templateService.saveTemplate();


  }


}