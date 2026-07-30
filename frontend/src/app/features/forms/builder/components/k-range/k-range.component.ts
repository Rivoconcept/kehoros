import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSliderModule } from '@angular/material/slider';

import { Question } from '../../../models/question.model';
import { FormsModule } from '@angular/forms';


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



  value = 0;



  get min(){

    return this.Question.rangeMin ?? 0;

  }



  get max(){

    return this.Question.rangeMax ?? 100;

  }



  get step(){

    return this.Question.rangeStep ?? 1;

  }



}