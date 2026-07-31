import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Question } from 'src/app/features/forms/models/question.model';


@Component({

  selector:'app-k-color',

  standalone:true,

  imports:[

    CommonModule,

    FormsModule,

    MatInputModule,

    MatFormFieldModule

  ],

  templateUrl:'./k-color.component.html',

  styleUrl:'./k-color.component.scss'

})
export class KColorComponent {


  @Input()
  Question!: Question;



  colorValue = '#000000';



  errorMessage:string | null = null;





  ngOnInit():void {


    if(this.Question.defaultValue){

      this.colorValue =
        this.Question.defaultValue;

    }


    this.updateValue();


  }







  updateColor(event:Event):void {


    const input =
      event.target as HTMLInputElement;


    this.colorValue =
      input.value;


    this.updateValue();


  }








  updateText(value:string):void {


    this.colorValue =
      value;


    this.updateValue();


  }







  updateValue():void {


    this.Question.defaultValue =
      this.colorValue;


    this.validate();


  }







  validate():void {


    this.errorMessage = null;




    if(

      this.Question.required &&

      !this.colorValue

    ){

      this.errorMessage =
        'Color is required';

      return;

    }





    if(

      !this.isValidColor(this.colorValue)

    ){

      this.errorMessage =
        'Invalid color format';

      return;

    }



  }







  isValidColor(value:string):boolean {


    switch(this.Question.colorFormat){


      case 'rgb':

        return /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(value);



      case 'hsl':

        return /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/.test(value);



      default:

        return /^#[0-9A-Fa-f]{6}$/.test(value);


    }


  }


}