import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Question } from '../../../models/question.model';


@Component({

  selector:'app-k-url',

  standalone:true,

  imports:[

    CommonModule,

    FormsModule,

    MatInputModule,

    MatFormFieldModule

  ],

  templateUrl:'./k-url.component.html',

  styleUrl:'./k-url.component.scss'

})
export class KUrlComponent {


  @Input()
  Question!: Question;



  urlValue = '';



}