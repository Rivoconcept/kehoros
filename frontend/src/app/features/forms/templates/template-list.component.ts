import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FormsService } from '../services/forms.services';



interface TemplateCard {

  id:string;

  title:string;

  description:string;

  category:string;

  published:boolean;

  Questions:number;

  responses:number;

  createdBy:string;

  updatedAt:Date;

}



@Component({

  selector:'app-template-list',

  standalone:true,

  imports:[

    CommonModule,

    FormsModule,

    RouterLink,

    MatButtonModule,

    MatIconModule,

    MatCardModule,

    MatMenuModule,

    MatChipsModule,

    MatFormFieldModule,

    MatInputModule

  ],

  templateUrl:'./template-list.component.html',

  styleUrl:'./template-list.component.scss'

})


export class TemplateListComponent implements OnInit {


  search = '';

  templates:TemplateCard[] = [];




  constructor(

    private router:Router,

    private formsService:FormsService

  ){}




  ngOnInit():void {

    this.loadTemplates();

  }






  loadTemplates():void {


    this.formsService
      .getTemplates()

      .subscribe({

        next:(data:any[])=>{


          this.templates = data.map(template=>({


            id:template.id,


            title:template.title,


            description:template.description ?? '',


            category:template.category ?? '',


            published:
              template.status === 'published'
              ||
              template.status === 'PUBLISHED',


            Questions:
              template.questions?.length
              ??
              template.Questions?.length
              ??
              0,


            responses:
              template.responses?.length
              ??
              0,


            createdBy:
              template.created_by
              ??
              'system',


            updatedAt:
              new Date(
                template.updated_at
                ??
                template.updatedAt
              )


          }));


        },


        error:error=>{


          console.error(

            'Erreur récupération templates',

            error

          );


        }


      });


  }







  get filteredTemplates():TemplateCard[]{


    return this.templates.filter(template=>


      template.title

        .toLowerCase()

        .includes(

          this.search.toLowerCase()

        )


    );


  }







  /**
   * Nouveau formulaire
   *
   * IMPORTANT :
   * On ne crée plus en base ici.
   * Le builder créera réellement le template
   * uniquement au moment du Save.
   */
  createTemplate():void {


    this.router.navigate([

      '/forms/builder',

      'new'

    ]);


  }







  edit(template:TemplateCard):void {


    this.router.navigate([

      '/forms/builder',

      template.id

    ]);


  }







  duplicate(template:TemplateCard):void {


    console.log(

      'duplicate',

      template

    );


  }







  archive(template:TemplateCard):void {


    console.log(

      'archive',

      template

    );


  }







  delete(template:TemplateCard):void {


    console.log(

      'delete',

      template

    );


  }



}