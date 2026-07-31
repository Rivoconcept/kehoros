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

  selector:'app-k-label',

  standalone:true,

  imports:[

    CommonModule

  ],

  templateUrl:'./k-label.component.html',

  styleUrl:'./k-label.component.scss'

})
export class KLabelComponent {


  @Input({required:true})
  Question!: Question;





  get labelText(): string {


    return (

      this.Question?.title ||

      this.Question?.defaultValue ||

      'Label'

    );


  }





  get labelColor(): string | null {


    return this.Question?.color ?? null;


  }





  get labelStyle(): string {


    return this.Question?.labelStyle ?? '';


  }





  get cssClass(): string {


    return this.Question?.cssClass ?? '';


  }


}