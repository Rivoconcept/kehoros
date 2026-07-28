import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';


import { BuilderService } from '../../services/builder.service';


import { QuestionCardComponent } from './question-card/question-card.component';



@Component({

    selector: 'app-canvas',

    standalone: true,

    imports: [

        CommonModule,

        DragDropModule,

        QuestionCardComponent

    ],

    templateUrl: './canvas.component.html',

    styleUrl: './canvas.component.scss'

})


export class CanvasComponent {


    constructor(

        public builder: BuilderService

    ){}



    drop(event: CdkDragDrop<any[]>) {


        this.builder.reorderQuestions(

            event.previousIndex,

            event.currentIndex

        );


    }


}