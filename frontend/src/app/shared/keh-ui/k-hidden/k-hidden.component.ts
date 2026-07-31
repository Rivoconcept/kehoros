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
  Question
} from 'src/app/features/forms/models/question.model';



@Component({

  selector:'app-k-hidden',

  standalone:true,

  imports:[

    CommonModule,

    ReactiveFormsModule

  ],

  templateUrl:'./k-hidden.component.html',

  styleUrl:'./k-hidden.component.scss'

})
export class KHiddenComponent {


  @Input({required:true})
  Question!: Question;



  @Input({required:true})
  control!: FormControl;



  get name(): string {


    return this.Question?.title ?? 'hidden';


  }



}