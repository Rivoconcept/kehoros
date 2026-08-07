import { Injectable } from '@angular/core';

import { BuilderStateService } from './builder-state.service';

import { Question } from '../../../models/question.model';
import { QuestionType } from '../../../models/question-type.enum';



@Injectable({
  providedIn:'root'
})
export class BuilderQuestionService {


constructor(
  private state: BuilderStateService
){}






addQuestion(
  type: QuestionType
): void {


  const template =
    this.state.template;



  if(!template)
    return;




  const question: Question = {


    id: crypto.randomUUID(),


    templateId:
      template.id,



    title:
      'New Question',



    description:
      '',



    type,



    required:
      false,



    placeholder:
      '',



    helpText:
      '',



    order:
      template.questions.length,



    score:
      1,



    options:
      [],



    defaultValue:
      null,



    width:
      '100%',



    hidden:
      false,



    readOnly:
      false,



    countryCode:
      '+261',



    minScale:
      1,



    maxScale:
      10,



    step:
      1,



    rangeMin:
      0,



    rangeMax:
      100,



    rangeStep:
      1,



    latitude:
      -18.8792,



    longitude:
      47.5079,



    zoom:
      13,



    addressFields:{


      street:true,

      city:true,

      state:false,

      zip:true,

      country:true


    },



    allowPastDate:
      true,



    allowFutureDate:
      true


  };





  const questions = [

    ...(template.questions ?? []),

    question

  ];





  console.log(
    'ADD QUESTION',
    question
  );



  console.log(
    'QUESTIONS TOTAL',
    questions.length
  );




  this.state.updateTemplateLocal({

    ...template,

    questions

  });





  this.state.selectQuestion(
    question.id
  );


}









updateQuestion(
  updated:Question
):void {



  const template =
    this.state.template;



  if(!template)
    return;




  const questions =
    template.questions.map(q =>

      q.id === updated.id

      ? updated

      : q

    );





  this.state.updateTemplateLocal({

    ...template,

    questions

  });





  this.state.selectQuestion(
    updated.id
  );



}









duplicateQuestion(
  id:string
):void {



  const template =
    this.state.template;



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



    id:
      crypto.randomUUID(),



    title:
      `${original.title} (copy)`,



    order:
      template.questions.length,



    options:
      (original.options ?? [])
      .map(option=>({


        ...option,


        id:
          crypto.randomUUID()


      }))


  };





  this.state.updateTemplateLocal({


    ...template,



    questions:[


      ...template.questions,


      copy


    ]


  });





  this.state.selectQuestion(
    copy.id
  );


}









removeQuestion(
  id:string
):void {



  const template =
    this.state.template;



  if(!template)
    return;





  const questions =

    template.questions

    .filter(
      q => q.id !== id
    )

    .map(
      (q,index)=>({

        ...q,

        order:index

      })
    );





  this.state.updateTemplateLocal({

    ...template,

    questions

  });





  this.state.setSelectedQuestion(
    null
  );


}



}