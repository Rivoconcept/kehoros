import {
  Component,
  Input
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Question
} from '../../../features/forms/models/question.model';



@Component({

  selector:'app-k-section',

  standalone:true,

  imports:[

    CommonModule

  ],

  templateUrl:'./k-section.component.html',

  styleUrl:'./k-section.component.scss'

})
export class KSectionComponent {


  @Input({required:true})
  Question!: Question;





  get cssClass():string {

    return this.Question.cssClass ?? '';

  }





  get title():string {

    return this.Question.title ?? '';


  }





  get description():string {

    return this.Question.description ?? '';


  }



}