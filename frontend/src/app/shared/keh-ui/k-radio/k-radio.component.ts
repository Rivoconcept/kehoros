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
  MatRadioModule
} from '@angular/material/radio';

import {
  FieldContainerComponent
} from '../core/field-container/field-container.component';

import {
  Question
} from '../../../features/forms/models/question.model';



@Component({

  selector:'app-k-radio',

  standalone:true,

  imports:[

    CommonModule,

    ReactiveFormsModule,

    MatRadioModule,

    FieldContainerComponent

  ],

  templateUrl:'./k-radio.component.html',

  styleUrl:'./k-radio.component.scss'

})
export class KRadioComponent {


  @Input({required:true})
  Question!: Question;



  @Input({required:true})
  control!: FormControl;


}