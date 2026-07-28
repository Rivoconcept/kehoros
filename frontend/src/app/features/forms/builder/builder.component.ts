import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';


import { BuilderService } from './services/builder.service';

import { Template } from '../models/template.model';
import { QuestionType } from '../models/question-type.enum';
import { Question } from '../models/question.model';


import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { QuestionPaletteComponent } from './components/question-palette/question-palette.component';

import { CanvasComponent } from './components/canvas/canvas.component';

import { PropertyEditorComponent } from './components/property-panel/property-editor/property-editor.component';

import { QuestionPreviewComponent } from './components/preview/question-preview.component';



@Component({
    selector: 'app-builder',
    standalone: true,

    imports: [

        CommonModule,

        DragDropModule,

        ToolbarComponent,

        QuestionPaletteComponent,

        CanvasComponent,

        PropertyEditorComponent,

        QuestionPreviewComponent

    ],

    templateUrl: './builder.component.html',
    styleUrl: './builder.component.scss'
})


export class BuilderComponent implements OnInit {


    template: Template | null = null;


    QuestionType = QuestionType;



    constructor(
        public builder: BuilderService
    ){}



    ngOnInit(): void {


        this.builder.template$.subscribe(template => {

            this.template = template;

        });



        if(!this.builder.template){

            this.builder.createTemplate(
                'Nouveau questionnaire'
            );

        }


    }



    addQuestion(type: QuestionType){

        this.builder.addQuestion(type);

    }



    drop(event: CdkDragDrop<Question[]>) {


        this.builder.reorderQuestions(

            event.previousIndex,

            event.currentIndex

        );


    }


}