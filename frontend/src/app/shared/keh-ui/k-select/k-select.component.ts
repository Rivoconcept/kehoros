import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { Question } from '../../../features/forms/models/question.model';


@Component({

  selector:'app-k-select',

  standalone:true,

  imports:[

    CommonModule,

    FormsModule,

    MatFormFieldModule,

    MatSelectModule

  ],

  templateUrl:'./k-select.component.html',

  styleUrl:'./k-select.component.scss'

})
export class KSelectComponent {


  @Input()
  Question!: Question;



  value:any = '';



}