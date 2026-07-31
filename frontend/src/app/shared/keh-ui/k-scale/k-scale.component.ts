import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatSliderModule } from '@angular/material/slider';

import { Question } from '../../../features/forms/models/question.model';


@Component({

  selector:'app-k-scale',

  standalone:true,

  imports:[

    CommonModule,

    FormsModule,

    MatSliderModule

  ],

  templateUrl:'./k-scale.component.html',

  styleUrl:'./k-scale.component.scss'

})
export class KScaleComponent {


  @Input()
  Question!: Question;



  value = 1;



  get min(){

    return this.Question.minScale ?? 1;

  }



  get max(){

    return this.Question.maxScale ?? 10;

  }



  get step(){

    return this.Question.step ?? 1;

  }



}