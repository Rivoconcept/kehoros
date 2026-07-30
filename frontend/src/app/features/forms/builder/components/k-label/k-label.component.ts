import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Question } from '../../../models/question.model';


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


  @Input()
  Question!: Question;



}