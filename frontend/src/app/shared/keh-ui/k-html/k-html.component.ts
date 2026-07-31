import {
  Component,
  Input
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Question
} from 'src/app/features/forms/models/question.model';



@Component({

  selector:'app-k-html',

  standalone:true,

  imports:[

    CommonModule

  ],

  templateUrl:'./k-html.component.html',

  styleUrl:'./k-html.component.scss'

})
export class KHtmlComponent {


  @Input({required:true})
  Question!: Question;




  get content(): string {


    return this.Question?.htmlContent ?? '';


  }




  get cssClass(): string {


    return this.Question?.cssClass ?? '';


  }




  get color(): string | null {


    return this.Question?.color ?? null;


  }




  get labelStyle(): string {


    return this.Question?.labelStyle ?? '';


  }


}