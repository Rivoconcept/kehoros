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

  selector:'app-k-paragraph',

  standalone:true,

  imports:[

    CommonModule

  ],

  templateUrl:'./k-paragraph.component.html',

  styleUrl:'./k-paragraph.component.scss'

})
export class KParagraphComponent {


  @Input({required:true})
  Question!: Question;



}