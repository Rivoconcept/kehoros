import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { Question } from '../../../features/forms/models/question.model';


@Component({

  selector:'app-k-switch',

  standalone:true,

  imports:[

    CommonModule,

    FormsModule,

    MatSlideToggleModule

  ],

  templateUrl:'./k-switch.component.html',

  styleUrl:'./k-switch.component.scss'

})
export class KSwitchComponent {


  @Input()
  Question!: Question;



  value = false;



}