import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatRadioModule } from '@angular/material/radio';

import { Question } from '../../../features/forms/models/question.model';


@Component({

  selector:'app-k-radio',

  standalone:true,

  imports:[

    CommonModule,

    FormsModule,

    MatRadioModule

  ],

  templateUrl:'./k-radio.component.html',

  styleUrl:'./k-radio.component.scss'

})
export class KRadioComponent {


  @Input()
  Question!: Question;



  value:any = '';



}