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

  selector:'app-k-datetime',

  standalone:true,

  imports:[

    CommonModule,

    ReactiveFormsModule,

    MatFormFieldModule,

    MatInputModule

  ],

  templateUrl:'./k-datetime.component.html',

  styleUrl:'./k-datetime.component.scss'

})
export class KDatetimeComponent {


  @Input({required:true})
  Question!: Question;


  @Input({required:true})
  control!: FormControl;



  get errorMessage():string | null {


    if(

      !this.control ||

      this.control.valid ||

      !this.control.touched

    ){

      return null;

    }



    if(this.control.hasError('required')){

      return 'Date and time is required';

    }



    if(this.control.hasError('min')){

      return 'Date and time is too old';

    }



    if(this.control.hasError('max')){

      return 'Date and time is too recent';

    }



    return 'Invalid date and time';


  }


}