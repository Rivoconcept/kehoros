import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Question } from '../../../models/question.model';


@Component({

  selector:'app-k-divider',

  standalone:true,

  imports:[

    CommonModule

  ],

  templateUrl:'./k-divider.component.html',

  styleUrl:'./k-divider.component.scss'

})
export class KDividerComponent {


  @Input()
  Question!: Question;



}