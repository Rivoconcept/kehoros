import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { Template } from '../../../models/template.model';
import { Question } from '../../../models/question.model';


@Injectable({
  providedIn: 'root'
})
export class BuilderStateService {


  private readonly templateSubject =
    new BehaviorSubject<Template | null>(null);


  template$ =
    this.templateSubject.asObservable();



  private readonly selectedQuestionSubject =
    new BehaviorSubject<Question | null>(null);


  selectedQuestion$ =
    this.selectedQuestionSubject.asObservable();



  private readonly dirtySubject =
    new BehaviorSubject<boolean>(false);


  dirty$ =
    this.dirtySubject.asObservable();




  get template(): Template | null {

    return this.templateSubject.value;

  }





  get questions(): Question[] {

    return this.template?.questions ?? [];

  }





  get visibleQuestions(): Question[] {

    return this.questions.filter(
      q => !q.hidden
    );

  }







  setTemplate(
    template: Template | null
  ): void {


    this.templateSubject.next(
      template
    );


  }







  updateTemplateLocal(
    template: Template
  ): void {



    const updatedTemplate: Template = {


      ...template,


      questions: [

        ...(template.questions ?? [])

      ],


      updatedAt: new Date()


    };



    console.log(
      'updateTemplateLocal questions =',
      updatedTemplate.questions.length
    );



    this.templateSubject.next(
      updatedTemplate
    );



    this.setDirty(true);


  }








  updateQuestions(
    questions: Question[]
  ): void {


    const current =
      this.template;



    if(!current)
      return;




    this.updateTemplateLocal({

      ...current,

      questions

    });


  }








  setDirty(
    value:boolean
  ):void {


    this.dirtySubject.next(
      value
    );


  }







  isDirty():boolean {


    return this.dirtySubject.value;


  }








  setSelectedQuestion(
    question: Question | null
  ):void {


    this.selectedQuestionSubject.next(
      question
    );


  }








  selectQuestion(
    id:string
  ):void {


    const question =
      this.questions.find(
        q => q.id === id
      );



    this.setSelectedQuestion(
      question ?? null
    );


  }








  getSelectedQuestion():Question|null {


    return this.selectedQuestionSubject.value;


  }







  reset():void {


    this.templateSubject.next(null);


    this.selectedQuestionSubject.next(null);


    this.dirtySubject.next(false);


  }



}