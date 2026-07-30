import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Question } from '../../../models/question.model';


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


  @Input()
  Question!: Question;



}