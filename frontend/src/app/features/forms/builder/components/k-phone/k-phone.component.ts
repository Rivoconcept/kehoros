import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Question } from '../../../models/question.model';



@Component({

  selector:'app-k-phone',

  standalone:true,

  imports:[

    CommonModule,

    MatFormFieldModule,

    MatInputModule,

    MatSelectModule

  ],

  templateUrl:'./k-phone.component.html',

  styleUrl:'./k-phone.component.scss'

})
export class KPhoneComponent {


  @Input()
  Question!: Question;



    countries = [

      {
        code:'+261',
        name:'Madagascar'
      },

      {
        code:'+33',
        name:'France'
      },

      {
        code:'+1',
        name:'USA'
      },

      {
        code:'+44',
        name:'UK'
      },

      {
        code:'+49',
        name:'Germany'
      },

      {
        code:'+81',
        name:'Japan'
      }

    ];




  get countryCode(): string {


    return this.Question?.countryCode ?? '+261';


  }



}
