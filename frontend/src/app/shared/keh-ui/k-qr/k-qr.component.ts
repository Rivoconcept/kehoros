import {
  Component,
  Input
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Question
} from '../../../features/forms/models/question.model';


@Component({

  selector:'app-k-qr',

  standalone:true,

  imports:[

    CommonModule

  ],

  templateUrl:'./k-qr.component.html',

  styleUrl:'./k-qr.component.scss'

})
export class KQrComponent {


  @Input({required:true})
  Question!: Question;





  get value(): string {


    return (

      this.Question?.defaultValue ??

      ''

    );


  }



}