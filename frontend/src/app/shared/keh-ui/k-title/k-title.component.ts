import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Question } from '../../../features/forms/models/question.model';


@Component({

  selector:'app-k-title',

  standalone:true,

  imports:[

    CommonModule

  ],

  templateUrl:'./k-title.component.html',

  styleUrl:'./k-title.component.scss'

})
export class KTitleComponent {


  @Input()
  Question!: Question;


}