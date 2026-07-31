import {
  Component,
  Input,
  ElementRef,
  ViewChild
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';

import {
  FieldContainerComponent
} from '../core/field-container/field-container.component';

import {
  Question
} from '../../../features/forms/models/question.model';



@Component({

  selector:'app-k-signature',

  standalone:true,

  imports:[

    CommonModule,

    ReactiveFormsModule,

    FieldContainerComponent

  ],

  templateUrl:'./k-signature.component.html',

  styleUrl:'./k-signature.component.scss'

})
export class KSignatureComponent {


  @Input({required:true})
  Question!: Question;



  @Input({required:true})
  control!: FormControl;



  @ViewChild('canvas')
  canvas!: ElementRef<HTMLCanvasElement>;



  drawing = false;


  context!: CanvasRenderingContext2D;





  ngAfterViewInit():void {


    const canvas =
      this.canvas.nativeElement;


    this.context =
      canvas.getContext('2d')!;


    this.context.lineWidth = 2;

    this.context.lineCap = 'round';


  }





  startDrawing(event:MouseEvent):void {


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





  draw(event:MouseEvent):void {


    if(!this.drawing){

      return;

    }



    this.context.lineTo(

      event.offsetX,

      event.offsetY

    );


    this.context.stroke();


    this.save();


  }





  stopDrawing():void {


    this.drawing = false;


  }





  clear():void {


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


    this.control.setValue(null);

    this.control.markAsDirty();


  }





  save():void {


    const image =

      this.canvas.nativeElement.toDataURL(
        'image/png'
      );


    this.control.setValue(image);


    this.control.markAsDirty();


  }



}