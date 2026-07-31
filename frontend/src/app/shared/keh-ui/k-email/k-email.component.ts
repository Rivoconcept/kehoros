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

  selector:'app-k-email',

  standalone:true,

  imports:[

    CommonModule,

    ReactiveFormsModule,

    MatFormFieldModule,

    MatInputModule

  ],

  templateUrl:'./k-email.component.html',

  styleUrl:'./k-email.component.scss'

})
export class KEmailComponent {


  @Input({required:true})
  Question!: Question;



  @Input({required:true})
  control!: FormControl;



  get errorMessage(): string | null {


    if(

      !this.control ||

      this.control.valid ||

      !(
        this.control.touched ||
        this.control.dirty
      )

    ){

      return null;

    }



    if(this.control.hasError('required')){

      return 'Email is required.';

    }



    if(this.control.hasError('email')){

      return this.Question.errorMessage 
        ?? 'Invalid email address.';

    }



    return 'Invalid email.';


  }


}