import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute
} from '@angular/router';


import {
  QuestionPreviewComponent
} from '../builder/components/preview/question-preview/question-preview.component';


import {
  TemplateService
} from '../services/template.service';


import {
  Template
} from '../models/template.model';




@Component({

  selector:'app-form-player',

  standalone:true,

  imports:[

    CommonModule,

    QuestionPreviewComponent

  ],

  templateUrl:'./form-player.component.html',

  styleUrl:'./form-player.component.scss'

})
export class FormPlayerComponent implements OnInit {



  template?:Template;


  loading = true;


  error = '';






  constructor(

    private route:ActivatedRoute,

    private templateService:TemplateService

  ){}





  ngOnInit():void {


    const id =

      this.route.snapshot.paramMap.get('id');



    if(!id){


      this.error =
        'Formulaire introuvable';


      this.loading=false;


      return;


    }





    this.templateService

    .findOne(id)

    .subscribe({



      next:(template)=>{


        this.template = template;


        this.loading=false;



      },



      error:(err)=>{


        console.error(err);


        this.error =
          'Impossible de charger le formulaire';


        this.loading=false;


      }



    });



  }



}