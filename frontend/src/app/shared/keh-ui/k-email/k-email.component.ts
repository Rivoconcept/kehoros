import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Question } from 'src/app/features/forms/models/question.model';



@Component({

  selector:'app-k-email',

  standalone:true,

  imports:[

    CommonModule,

    FormsModule,

    MatFormFieldModule,

    MatInputModule

  ],

  templateUrl:'./k-email.component.html',

  styleUrl:'./k-email.component.scss'

})
export class KEmailComponent {


  @Input()
  Question!: Question;



  emailValue = '';



  errorMessage:string | null = null;







  ngOnInit():void {


    this.emailValue =

      this.Question.defaultValue ??

      '';

  }







  updateEmail(value:string):void {


    this.emailValue = value;



    this.Question.defaultValue =

      this.emailValue;



    this.validate();


  }







  validate():void {


    this.errorMessage = null;





    if(

      this.Question.required &&

      !this.emailValue

    ){

      this.errorMessage =
        'Email is required';


      return;

    }







    if(!this.emailValue){

      return;

    }







    const emailRegex =

      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;







    if(!emailRegex.test(this.emailValue)){


      this.errorMessage =

        this.Question.errorMessage ??

        'Invalid email address';


    }


  }



}