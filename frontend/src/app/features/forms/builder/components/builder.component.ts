import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import {
  DragDropModule,
  CdkDragDrop
} from '@angular/cdk/drag-drop';

import { A11yModule } from '@angular/cdk/a11y';



import { Template } from '../../models/template.model';

import { Question } from '../../models/question.model';


import { ToolbarComponent } from './toolbar/toolbar.component';
import { QuestionPaletteComponent } from './question-palette/question-palette.component';
import { CanvasComponent } from './canvas/canvas.component';
import { PropertyEditorComponent } from './property-panel/property-editor/property-editor.component';
import { QuestionPreviewComponent } from './preview/question-preview/question-preview.component';
import { BuilderService } from '../services/builder.service';
import { QuestionType } from '../../models/question-type.enum';




@Component({

  selector:'app-builder',

  standalone:true,

  imports:[

    CommonModule,

    DragDropModule,

    A11yModule,

    ToolbarComponent,

    QuestionPaletteComponent,

    CanvasComponent,

    PropertyEditorComponent,

    QuestionPreviewComponent

  ],

  templateUrl:'./builder.component.html',

  styleUrl:'./builder.component.scss'

})


export class BuilderComponent implements OnInit {


  template:Template|null = null;


  QuestionType = QuestionType;



  constructor(

    public builder:BuilderService,

    private route:ActivatedRoute

  ){}





  ngOnInit():void {


    this.route.paramMap.subscribe(params=>{


      const id = params.get('id');



      /**
       * Edition d'un questionnaire existant
       */
      if(id && id !== 'new'){


        this.builder.loadTemplate(id);


      }


      /**
       * Nouveau questionnaire
       *
       * Création uniquement mémoire.
       * Aucun POST ici.
       */
      else{


        this.builder.createTemplateLocal({

          title:'New Questionnaire',

          description:'',

          category:'general'

        });


      }


    });





    this.builder.template$

      .subscribe(template=>{


        this.template = template;


      });



  }





  addQuestion(
    type:QuestionType
  ):void {


    this.builder.addQuestion(type);


  }





  // drop(
  //   event:CdkDragDrop<Question[]>
  // ):void {


  //   this.builder.reorderQuestions(

  //     event.previousIndex,

  //     event.currentIndex

  //   );


  // }



}