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
  MatInputModule
} from '@angular/material/input';

import {
  FieldContainerComponent
} from '../core/field-container/field-container.component';

import {
  Question
} from '../../../features/forms/models/question.model';



@Component({

  selector:'app-k-url',

  standalone:true,

  imports:[

    CommonModule,

    ReactiveFormsModule,

    MatFormFieldModule,

    MatInputModule,

    FieldContainerComponent

  ],

  templateUrl:'./k-url.component.html',

  styleUrl:'./k-url.component.scss'

})
export class KUrlComponent {


  @Input({required:true})
  Question!: Question;



  @Input({required:true})
  control!: FormControl;



}