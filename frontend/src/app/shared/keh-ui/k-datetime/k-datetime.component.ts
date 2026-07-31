import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Question } from '../../../features/forms/models/question.model';


@Component({

  selector:'app-k-datetime',

  standalone:true,

  imports:[

    CommonModule,

    FormsModule,

    MatFormFieldModule,

    MatInputModule

  ],

  templateUrl:'./k-datetime.component.html',

  styleUrl:'./k-datetime.component.scss'

})
export class KDatetimeComponent {


  @Input()
  Question!: Question;



  value = '';



}