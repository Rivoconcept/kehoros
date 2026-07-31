import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from 'src/app/features/forms/models/question.model';



@Component({

  selector:'app-k-hidden',

  standalone:true,

  imports:[

    CommonModule

  ],

  templateUrl:'./k-hidden.component.html',

  styleUrl:'./k-hidden.component.scss'

})
export class KHiddenComponent {


  @Input()
  Question!: Question;





  get value(): any {


    return this.Question?.defaultValue ?? '';


  }





  get name(): string {


    return this.Question?.title ?? 'hidden';


  }



}