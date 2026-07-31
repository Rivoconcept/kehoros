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
  Question
} from 'src/app/features/forms/models/question.model';



@Component({

  selector:'app-field-errors',

  standalone:true,

  imports:[

    CommonModule

  ],

  templateUrl:'./field-errors.component.html',

  styleUrl:'./field-errors.component.scss'

})
export class FieldErrorsComponent {



  @Input({required:true})
  control!: FormControl;



  @Input({required:true})
  Question!: Question;






  get invalid():boolean {


    return !!this.control &&

      this.control.invalid &&

      (

        this.control.touched ||

        this.control.dirty

      );


  }






  get message():string | null {


    if(!this.invalid){


      return null;


    }






    if(this.control.hasError('required')){


      return 'This field is required.';


    }






    if(this.control.hasError('email')){


      return this.Question.errorMessage ??

        'Invalid email address.';


    }






    if(this.control.hasError('minlength')){


      return `Minimum ${this.Question.minLength} characters.`;


    }






    if(this.control.hasError('maxlength')){


      return `Maximum ${this.Question.maxLength} characters.`;


    }






    if(this.control.hasError('min')){


      return `Minimum value: ${this.Question.minValue}`;


    }






    if(this.control.hasError('max')){


      return `Maximum value: ${this.Question.maxValue}`;


    }






    if(this.control.hasError('pattern')){


      return this.Question.errorMessage ??

        'Invalid format.';


    }






    return 'Invalid value.';


  }



}