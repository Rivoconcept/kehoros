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
  MatSliderModule
} from '@angular/material/slider';

import {
  FieldContainerComponent
} from '../core/field-container/field-container.component';

import {
  Question
} from 'src/app/features/forms/models/question.model';



@Component({

  selector:'app-k-range',

  standalone:true,

  imports:[

    CommonModule,

    ReactiveFormsModule,

    MatSliderModule,

    FieldContainerComponent

  ],

  templateUrl:'./k-range.component.html',

  styleUrl:'./k-range.component.scss'

})
export class KRangeComponent {


  @Input({required:true})
  Question!: Question;



  @Input({required:true})
  control!: FormControl;





  get min():number {

    return this.Question.rangeMin ?? 0;

  }





  get max():number {

    return this.Question.rangeMax ?? 100;

  }





  get step():number {

    return this.Question.rangeStep ?? 1;

  }



}