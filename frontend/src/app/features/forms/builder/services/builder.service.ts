import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Template } from '../../models/template.model';
import { Question } from '../../models/question.model';
import { QuestionType } from '../../models/question-type.enum';

import { moveItemInArray } from '@angular/cdk/drag-drop';


@Injectable({
  providedIn:'root'
})
export class BuilderService {


  private readonly STORAGE_KEY =
    'kehoros-template';



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







  get template():Template | null {

    return this.templateSubject.value;

  }







  get questions():Question[] {

    return this.template?.questions ?? [];

  }







  get visibleQuestions():Question[] {

    return this.questions.filter(
      question => !question.hidden
    );

  }








  createTemplate(title:string):void {


    const template:Template = {


      id:crypto.randomUUID(),


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


    template.updatedAt =
      new Date();




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



    try {


      const template:Template =
        JSON.parse(data);



      template.createdAt =
        new Date(template.createdAt);



      template.updatedAt =
        new Date(template.updatedAt);



      this.templateSubject.next(
        template
      );


    }
    catch(error){


      console.error(
        'Chargement template impossible',
        error
      );


    }


  }









  selectQuestion(id:string):void {


    const question =
      this.questions.find(
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


          const template =
            this.template;



          if(!template)
            return;





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


        options:[],



        // Default values

        defaultValue:null,



        // Display

        width:'100%',


        hidden:false,


        readOnly:false,



        // Phone

        countryCode:'+261',



        // Range / Scale

        minScale:1,


        maxScale:10,


        step:1,


        rangeMin:0,


        rangeMax:100,


        rangeStep:1,



        // Map

        latitude: -18.8792,


        longitude:47.5079,


        zoom:13,



        // Address

        addressFields:{

          street:true,

          city:true,

          state:false,

          zip:true,

          country:true

        },



        // Date

        allowPastDate:true,


        allowFutureDate:true



      };




    template.questions.push(
      question
    );



    this.save(template);



    this.selectQuestion(
      question.id
    );


  }









  updateQuestion(updated:Question):void {


    const template =
      this.template;



    if(!template)
      return;





    const index =
      template.questions.findIndex(
        q => q.id === updated.id
      );



    if(index === -1)
      return;




    template.questions[index] =
      {

        ...updated,

        options:[
          ...updated.options
        ]

      };




    this.save(template);



    this.selectQuestion(
      updated.id
    );


  }









  duplicateQuestion(id:string):void {


    const template =
      this.template;



    if(!template)
      return;





    const original =
      template.questions.find(
        q => q.id === id
      );



    if(!original)
      return;





    const copy:Question = {


      ...original,


      id:crypto.randomUUID(),


      title:
        `${original.title} (copy)`,



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





    template.questions.push(
      copy
    );



    this.save(template);



    this.selectQuestion(
      copy.id
    );


  }









  removeQuestion(id:string):void {


    const template =
      this.template;



    if(!template)
      return;





    template.questions =
      template.questions.filter(
        q => q.id !== id
      );




    template.questions.forEach(
      (question,index)=>{

        question.order=index;

      }
    );




    this.save(template);



    this.selectedQuestionSubject.next(
      null
    );


  }









  reorderQuestions(
    previousIndex:number,
    currentIndex:number
  ):void {



    const template =
      this.template;



    if(!template)
      return;





    const selected =
      this.selectedQuestionSubject.value;





    moveItemInArray(

      template.questions,

      previousIndex,

      currentIndex

    );






    template.questions.forEach(
      (question,index)=>{

        question.order=index;

      }
    );





    this.save(template);





    if(selected){

      this.selectQuestion(
        selected.id
      );

    }



  }









  exportTemplate():void {


    const template =
      this.template;



    if(!template)
      return;





    const json =
      JSON.stringify(
        template,
        null,
        2
      );





    const blob =
      new Blob(

        [json],

        {
          type:'application/json'
        }

      );





    const url =
      URL.createObjectURL(
        blob
      );





    const link =
      document.createElement('a');



    link.href=url;



    link.download =
      `${template.title}.json`;



    link.click();



    URL.revokeObjectURL(url);


  }









  importTemplate(file:File):void {


    const reader =
      new FileReader();





    reader.onload = ()=>{


      try{


        const template:Template =
          JSON.parse(
            reader.result as string
          );





        template.createdAt =
          new Date(
            template.createdAt
          );



        template.updatedAt =
          new Date(
            template.updatedAt
          );





        this.save(template);




        this.selectedQuestionSubject.next(
          null
        );



      }
      catch(error){


        console.error(
          'Import JSON impossible',
          error
        );


      }


    };





    reader.readAsText(file);


  }




}