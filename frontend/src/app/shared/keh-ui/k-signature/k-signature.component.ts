import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Question } from '../../../features/forms/models/question.model';


@Component({

  selector:'app-k-signature',

  standalone:true,

  imports:[

    CommonModule

  ],

  templateUrl:'./k-signature.component.html',

  styleUrl:'./k-signature.component.scss'

})
export class KSignatureComponent {


  @Input()
  Question!: Question;



  @ViewChild('canvas')
  canvas!: ElementRef<HTMLCanvasElement>;



  drawing = false;

  context!: CanvasRenderingContext2D;



  ngAfterViewInit(){


    const canvas =
      this.canvas.nativeElement;


    this.context =
      canvas.getContext('2d')!;


    this.context.lineWidth = 2;

    this.context.lineCap = 'round';


  }



  startDrawing(event:MouseEvent){


    if(this.Question.readOnly){

      return;

    }


    this.drawing = true;


    this.context.beginPath();


    this.context.moveTo(

      event.offsetX,

      event.offsetY

    );


  }



  draw(event:MouseEvent){


    if(!this.drawing){

      return;

    }



    this.context.lineTo(

      event.offsetX,

      event.offsetY

    );


    this.context.stroke();


  }



  stopDrawing(){


    this.drawing = false;


  }



  clear(){


    if(this.Question.readOnly){

      return;

    }


    const canvas =
      this.canvas.nativeElement;


    this.context.clearRect(

      0,

      0,

      canvas.width,

      canvas.height

    );


  }



}