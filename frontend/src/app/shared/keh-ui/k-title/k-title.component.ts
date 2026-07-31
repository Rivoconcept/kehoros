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

  selector:'app-k-title',

  standalone:true,

  imports:[

    CommonModule

  ],

  templateUrl:'./k-title.component.html',

  styleUrl:'./k-title.component.scss'

})
export class KTitleComponent {


  @Input({required:true})
  Question!: Question;



  get title():string {

    return this.Question?.title ?? '';

  }



  get cssClass():string {

    return this.Question?.cssClass ?? '';

  }



  get color():string | null {

    return this.Question?.color ?? null;

  }



  get style():string {

    return this.Question?.labelStyle ?? '';

  }



}