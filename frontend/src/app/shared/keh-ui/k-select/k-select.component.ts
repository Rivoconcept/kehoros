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
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatSelectModule
} from '@angular/material/select';


import {
  Question
} from '../../../features/forms/models/question.model';

import {
  FieldContainerComponent
} from '../core/field-container/field-container.component';



@Component({

  selector:'app-k-select',

  standalone:true,

  imports:[

    CommonModule,

    ReactiveFormsModule,

    MatFormFieldModule,

    MatSelectModule,

    FieldContainerComponent

  ],

  templateUrl:'./k-select.component.html',

  styleUrl:'./k-select.component.scss'

})
export class KSelectComponent {


  @Input({required:true})
  Question!: Question;



  @Input({required:true})
  control!: FormControl;


}