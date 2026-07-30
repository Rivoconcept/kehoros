import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Question } from '../../../models/question.model';


@Component({

  selector:'app-k-map',

  standalone:true,

  imports:[

    CommonModule

  ],

  templateUrl:'./k-map.component.html',

  styleUrl:'./k-map.component.scss'

})
export class KMapComponent {


  @Input()
  Question!: Question;



  get latitude(){

    return this.Question.latitude ?? -18.8792;

  }



  get longitude(){

    return this.Question.longitude ?? 47.5079;

  }



  get zoom(){

    return this.Question.zoom ?? 13;

  }



}