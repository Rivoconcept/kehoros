import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Question } from '../../../features/forms/models/question.model';


@Component({

  selector:'app-k-rating',

  standalone:true,

  imports:[

    CommonModule

  ],

  templateUrl:'./k-rating.component.html',

  styleUrl:'./k-rating.component.scss'

})
export class KRatingComponent {


  @Input()
  Question!: Question;



  value = 0;



  get maxRating(){

    return this.Question.maxScale ?? 5;

  }



  stars(){

    return Array(this.maxRating);

  }



  setRating(index:number){

    if(!this.Question.readOnly){

      this.value = index + 1;

    }

  }



}