import {
  Component,
  Input
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  MatFormFieldModule
}
from '@angular/material/form-field';

import {
  MatInputModule
}
from '@angular/material/input';

import {
  MatIconModule
}
from '@angular/material/icon';

import {
  MatButtonModule
}
from '@angular/material/button';
import { Question } from 'src/app/features/forms/models/question.model';




@Component({

  selector:'app-k-password',

  standalone:true,

  imports:[

    CommonModule,

    FormsModule,

    MatFormFieldModule,

    MatInputModule,

    MatIconModule,

    MatButtonModule

  ],

  templateUrl:'./k-password.component.html',

  styleUrl:'./k-password.component.scss'

})
export class KPasswordComponent {


  @Input()
  Question!:Question;



  passwordValue = '';



  hidePassword = true;



  errorMessage:string | null = null;





  ngOnInit():void {


    this.passwordValue =

      this.Question.defaultValue ??

      '';



  }







  togglePassword():void {


    this.hidePassword =

      !this.hidePassword;


  }







  updatePassword():void {


    this.Question.defaultValue =

      this.passwordValue;


    this.validate();


  }







  validate():void {


    this.errorMessage = null;




    if(

      this.Question.required &&

      !this.passwordValue

    ){

      this.errorMessage =
        'Password is required';

      return;

    }





    if(

      this.Question.minLength &&

      this.passwordValue.length < this.Question.minLength

    ){

      this.errorMessage =

        `Minimum ${this.Question.minLength} characters`;


      return;

    }






    if(

      this.Question.maxLength &&

      this.passwordValue.length > this.Question.maxLength

    ){

      this.errorMessage =

        `Maximum ${this.Question.maxLength} characters`;


      return;

    }


  }



}