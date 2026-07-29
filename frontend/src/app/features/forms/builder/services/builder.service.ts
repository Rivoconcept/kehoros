import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Template } from '../../models/template.model';
import { Question } from '../../models/question.model';
import { QuestionType } from '../../models/question-type.enum';

import { moveItemInArray } from '@angular/cdk/drag-drop';


@Injectable({
  providedIn: 'root'
})
export class BuilderService {


  private readonly STORAGE_KEY = 'kehoros-template';



  private readonly templateSubject =
    new BehaviorSubject<Template | null>(null);


  template$ =
    this.templateSubject.asObservable();



  private readonly selectedQuestionSubject =
    new BehaviorSubject<Question | null>(null);


  selectedQuestion$ =
    this.selectedQuestionSubject.asObservable();





  constructor(){

    this.load();

  }





  get template(): Template | null {

    return this.templateSubject.value;

  }





  get questions(): Question[] {

    return this.template?.questions ?? [];

  }






  createTemplate(title:string):void {


    const template:Template = {

      id: crypto.randomUUID(),

      title,

      description:'',

      category:'',

      published:false,

      archived:false,

      version:1,

      questions:[],

      createdAt:new Date(),

      updatedAt:new Date()

    };


    this.save(template);

  }







  save(template:Template):void {


    template.updatedAt = new Date();



    localStorage.setItem(

      this.STORAGE_KEY,

      JSON.stringify(template)

    );



    this.templateSubject.next({

      ...template,

      questions:[
        ...template.questions
      ]

    });


  }







  load():void {


    const data =
      localStorage.getItem(
        this.STORAGE_KEY
      );



    if(!data){

      return;

    }



    const template:Template =
      JSON.parse(data);



    template.createdAt =
      new Date(template.createdAt);



    template.updatedAt =
      new Date(template.updatedAt);



    this.templateSubject.next(template);


  }








  selectQuestion(id:string):void {


    const question =
      this.template?.questions.find(
        q => q.id === id
      );



    this.selectedQuestionSubject.next(
      question ?? null
    );


  }








  getSelectedQuestion():Question | null {

    return this.selectedQuestionSubject.value;

  }







  addQuestion(type:QuestionType):void {


    const template=this.template;


    if(!template) return;



    const question:Question = {


      id:crypto.randomUUID(),


      templateId:template.id,


      title:'New Question',


      description:'',


      type,


      required:false,


      placeholder:'',


      helpText:'',


      order:template.questions.length,


      score:1,


      options:[]

    };



    template.questions.push(question);



    this.save(template);



    this.selectQuestion(question.id);


  }








  updateQuestion(updated:Question):void {


    const template=this.template;


    if(!template) return;



    const index =
      template.questions.findIndex(
        q => q.id === updated.id
      );



    if(index === -1) return;



    template.questions[index] =
      updated;



    this.save(template);



    this.selectQuestion(updated.id);


  }








  duplicateQuestion(id:string):void {


    const template=this.template;


    if(!template) return;



    const original =
      template.questions.find(
        q => q.id === id
      );



    if(!original) return;



    const copy:Question = {

      ...original,

      id:crypto.randomUUID(),

      title:
        original.title + ' (copy)',


      order:
        template.questions.length,


      options:
        original.options.map(
          option => ({
            ...option,
            id:crypto.randomUUID()
          })
        )

    };



    template.questions.push(copy);



    this.save(template);



    this.selectQuestion(copy.id);


  }








  removeQuestion(id:string):void {


    const template=this.template;


    if(!template) return;



    template.questions =
      template.questions.filter(
        q => q.id !== id
      );



    template.questions.forEach(
      (q: Question, index: number)=>{

        q.order = index;

      }
    );



    this.save(template);



    this.selectedQuestionSubject.next(null);


  }








  reorderQuestions(
    previousIndex:number,
    currentIndex:number
  ):void {


    const template=this.template;


    if(!template) return;



    moveItemInArray(

      template.questions,

      previousIndex,

      currentIndex

    );



    template.questions.forEach(
      (q,index)=>{

        q.order=index;

      }
    );



    this.save(template);


  }



}