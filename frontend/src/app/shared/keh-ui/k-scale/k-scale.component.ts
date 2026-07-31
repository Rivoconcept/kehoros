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
} from '../../../features/forms/models/question.model';



@Component({

  selector:'app-k-scale',

  standalone:true,

  imports:[

    CommonModule,

    ReactiveFormsModule,

    MatSliderModule,

    FieldContainerComponent

  ],

  templateUrl:'./k-scale.component.html',

  styleUrl:'./k-scale.component.scss'

})
export class KScaleComponent {


  @Input({required:true})
  Question!: Question;



  @Input({required:true})
  control!: FormControl;





  get min():number {

    return this.Question.minScale ?? 1;

  }





  get max():number {

    return this.Question.maxScale ?? 10;

  }





  get step():number {

    return this.Question.step ?? 1;

  }



}