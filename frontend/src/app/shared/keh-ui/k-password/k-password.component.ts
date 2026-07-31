import {
  Component,
  Input
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ReactiveFormsModule,
  FormControl
} from '@angular/forms';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatInputModule
} from '@angular/material/input';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  MatButtonModule
} from '@angular/material/button';


import {
  Question
} from 'src/app/features/forms/models/question.model';



@Component({

  selector:'app-k-password',

  standalone:true,

  imports:[

    CommonModule,

    ReactiveFormsModule,

    MatFormFieldModule,

    MatInputModule,

    MatIconModule,

    MatButtonModule

  ],

  templateUrl:'./k-password.component.html',

  styleUrl:'./k-password.component.scss'

})
export class KPasswordComponent {



  @Input({required:true})
  Question!: Question;



  @Input({required:true})
  control!: FormControl;



  hidePassword = true;






  togglePassword():void {


    this.hidePassword =

      !this.hidePassword;


  }







  get errorMessage():string | null {


    if(

      !this.control ||

      !this.control.touched ||

      this.control.valid

    ){

      return null;

    }






    if(this.control.hasError('required')){

      return 'Password is required';

    }






    if(this.control.hasError('minlength')){

      return (

        `Minimum ${this.Question.minLength} characters`

      );

    }






    if(this.control.hasError('maxlength')){

      return (

        `Maximum ${this.Question.maxLength} characters`

      );

    }






    if(this.control.hasError('pattern')){

      return (

        this.Question.errorMessage ??

        'Invalid password format'

      );

    }






    return 'Invalid password';


  }



}