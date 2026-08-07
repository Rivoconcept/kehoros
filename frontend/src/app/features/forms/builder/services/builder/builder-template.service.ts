import { Injectable } from '@angular/core';

import { BuilderStateService } 
from './builder-state.service';

import { Template } 
from '../../../models/template.model';

import { FormsService } 
from '../../../services/forms.services';
import { QuestionService } from '../question.service';



@Injectable({
providedIn:'root'
})
export class BuilderTemplateService {


private creating = false;



constructor(

private formsService:FormsService,

private questionService:QuestionService,

private state:BuilderStateService

){}








createTemplateLocal(
data:{
title:string;
description?:string;
category?:string;
}
):void {



const template:Template = {


id:'',


title:data.title,


description:
data.description ?? '',


category:
data.category ?? 'general',


published:false,


archived:false,


version:1,


status:'DRAFT',


questions:[],


createdAt:new Date(),


updatedAt:new Date()


};




this.state.setTemplate(
template
);



this.state.setDirty(
true
);


}









loadTemplate(
id:string
):void {



this.formsService
.getTemplateById(id)
.subscribe({


next:(data:any)=>{



const template:Template = {


id:data.id,


title:data.title,


description:
data.description ?? '',


category:
data.category ?? '',


published:
data.status === 'PUBLISHED',


archived:
data.status === 'ARCHIVED',


version:
data.version ?? 1,


status:
data.status,


questions:
data.questions ?? [],


createdAt:
new Date(
data.created_at ??
data.createdAt
),


updatedAt:
new Date(
data.updated_at ??
data.updatedAt
)


};




this.state.setTemplate(
template
);



this.state.setDirty(
false
);



},


error:error=>{


console.error(
'Erreur chargement template',
error
);


}



});



}









saveTemplate(
template?:Template
):void {



const current =
template ??
this.state.template;



if(!current)
return;



if(this.creating)
return;





const payload = {


title:
current.title,


description:
current.description ?? '',


category:
current.category ?? 'general'


};






/**
 *
 * CREATION TEMPLATE
 *
 */
if(!current.id){



this.creating=true;



this.formsService
.createTemplate(payload)
.subscribe({



next:(result:any)=>{



const templateId =
result.id;



const questions =
current.questions ?? [];





if(questions.length === 0){


this.finishSave(
current,
result
);


return;

}






let saved = 0;





questions.forEach(question=>{



const questionPayload = {

  template_id: templateId,

  title:
    question.title?.trim() || 'New Question',

  description:
    question.description ?? '',

  type:
    question.type,

  required:
    question.required ?? false,

  position:
    question.order ?? 0,

  points:
    question.score ?? 0,

  settings: {

    placeholder:
      question.placeholder ?? '',

    helpText:
      question.helpText ?? '',

    width:
      question.width ?? '100%',

    hidden:
      question.hidden ?? false,

    readOnly:
      question.readOnly ?? false

  }

};






/**
 *
 * CORRECTION IMPORTANTE
 *
 * Avant :
 * POST /forms/templates/:id/questions
 *
 * Maintenant :
 * POST /forms/questions
 *
 */



this.questionService
.createQuestion(
  {
    ...questionPayload,
    templateId
  }
)
.subscribe({



next:()=>{



saved++;



if(saved === questions.length){



this.finishSave(
current,
result
);



}



},



error:error=>{


console.error(
'Erreur création question',
error
);


}



});





});




},



error:error=>{


this.creating=false;


console.error(
'Erreur création template',
error
);



}



});



return;

}









/**
 *
 * TEMPLATE EXISTANT
 *
 */
this.formsService
.updateTemplate(
current.id,
payload
)
.subscribe({



next:(result:any)=>{


this.state.updateTemplateLocal({


...current,


updatedAt:
new Date(
result.updated_at ??
result.updatedAt
)



});



this.state.setDirty(
false
);



},



error:error=>{


console.error(
'Erreur update template',
error
);



}



});




}









private finishSave(
current:Template,
result:any
):void {



this.creating=false;




this.state.setTemplate({


...current,


id:
result.id,


updatedAt:
new Date(
result.updated_at ??
result.updatedAt
)



});





this.state.setDirty(
false
);



}



}