import {
  Component,
  Input
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormControl
} from '@angular/forms';

import {
  FieldErrorsComponent
} from '../field-errors/field-errors.component';

import {
  Question
} from 'src/app/features/forms/models/question.model';



@Component({

  selector:'app-field-wrapper',

  standalone:true,

  imports:[

    CommonModule,

    FieldErrorsComponent

  ],

  templateUrl:'./field-wrapper.component.html',

  styleUrl:'./field-wrapper.component.scss'

})
export class FieldWrapperComponent {



  @Input({required:true})
  Question!:Question;



  @Input({required:true})
  control!:FormControl;




  get hasHelp():boolean {

    return !!this.Question?.helpText;

  }




}