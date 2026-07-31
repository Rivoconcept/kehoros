import {
  Component,
  Input
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

  selector:'app-k-rating',

  standalone:true,

  imports:[

    CommonModule,

    ReactiveFormsModule,

    FieldContainerComponent

  ],

  templateUrl:'./k-rating.component.html',

  styleUrl:'./k-rating.component.scss'

})
export class KRatingComponent {


  @Input({required:true})
  Question!: Question;



  @Input({required:true})
  control!: FormControl;





  get maxRating():number {

    return this.Question.maxScale ?? 5;

  }





  stars(){

    return Array(this.maxRating);

  }





  setRating(index:number):void {


    if(!this.Question.readOnly){

      this.control.setValue(index + 1);

      this.control.markAsDirty();

      this.control.markAsTouched();

    }


  }



}