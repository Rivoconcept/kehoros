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
  Question
} from '../../../features/forms/models/question.model';



@Component({

  selector:'app-k-number',

  standalone:true,

  imports:[

    CommonModule,

    ReactiveFormsModule,

    MatFormFieldModule,

    MatInputModule

  ],

  templateUrl:'./k-number.component.html',

  styleUrl:'./k-number.component.scss'

})
export class KNumberComponent {


  @Input({required:true})
  Question!: Question;



  @Input({required:true})
  control!: FormControl;







  get errorMessage(): string | null {


    if(

      !this.control ||

      this.control.valid ||

      !this.control.touched

    ){

      return null;

    }






    if(this.control.hasError('required')){

      return 'This field is required.';

    }






    if(this.control.hasError('min')){

      return `Minimum value: ${this.Question.minValue}`;

    }






    if(this.control.hasError('max')){

      return `Maximum value: ${this.Question.maxValue}`;

    }



    return 'Invalid number.';


  }


}