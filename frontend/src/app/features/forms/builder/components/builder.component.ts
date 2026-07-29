import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';


import { BuilderService } from '../services/builder.service';

import { Template } from '../../models/template.model';
import { QuestionType } from '../../models/question-type.enum';
import { Question } from '../../models/question.model';


import { ToolbarComponent } from './toolbar/toolbar.component';
import { QuestionPaletteComponent } from './question-palette/question-palette.component';

import { CanvasComponent } from './canvas/canvas.component';

import { PropertyEditorComponent } from './property-panel/property-editor/property-editor.component';

import { QuestionPreviewComponent } from './preview/question-preview.component';
import { A11yModule } from "@angular/cdk/a11y";



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
    QuestionPreviewComponent,
    A11yModule
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
                'New Questionnaire'
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