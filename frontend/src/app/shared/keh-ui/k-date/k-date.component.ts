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
  FieldErrorsComponent
} from '../../keh-ui/core/field-errors/field-errors.component';

import {
  Question
} from 'src/app/features/forms/models/question.model';



@Component({

  selector:'app-k-date',

  standalone:true,

  imports:[

    CommonModule,

    ReactiveFormsModule,

    MatFormFieldModule,

    MatInputModule,

    FieldErrorsComponent

  ],

  templateUrl:'./k-date.component.html',

  styleUrl:'./k-date.component.scss'

})
export class KDateComponent {


  @Input({required:true})
  Question!: Question;


  @Input({required:true})
  control!: FormControl;


}