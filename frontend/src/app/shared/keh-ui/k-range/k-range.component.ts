import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatSliderModule } from '@angular/material/slider';
import { Question } from 'src/app/features/forms/models/question.model';


@Component({

  selector:'app-k-range',

  standalone:true,

  imports:[

    CommonModule,

    FormsModule,

    MatSliderModule

  ],

  templateUrl:'./k-range.component.html',

  styleUrl:'./k-range.component.scss'

})
export class KRangeComponent {


  @Input()
  Question!: Question;



  value:number = 0;



  errorMessage:string | null = null;





  ngOnInit():void {


    this.value =

      this.Question.defaultValue ??

      this.min;


    this.updateValue();


  }







  get min():number {


    return this.Question.rangeMin ?? 0;


  }







  get max():number {


    return this.Question.rangeMax ?? 100;


  }







  get step():number {


    return this.Question.rangeStep ?? 1;


  }







  updateValue():void {


    this.Question.defaultValue =
      this.value;


    this.validate();


  }







  validate():void {


    this.errorMessage = null;




    if(

      this.Question.required &&

      (
        this.value === null ||

        this.value === undefined

      )

    ){

      this.errorMessage =
        'Value is required';

      return;

    }





    if(this.value < this.min){


      this.errorMessage =
        `Minimum value is ${this.min}`;

      return;

    }





    if(this.value > this.max){


      this.errorMessage =
        `Maximum value is ${this.max}`;

      return;

    }


  }



}