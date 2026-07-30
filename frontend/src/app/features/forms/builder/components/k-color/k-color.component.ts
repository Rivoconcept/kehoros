import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Question } from '../../../models/question.model';


@Component({

  selector:'app-k-color',

  standalone:true,

  imports:[

    CommonModule,

    FormsModule,

    MatInputModule,

    MatFormFieldModule

  ],

  templateUrl:'./k-color.component.html',

  styleUrl:'./k-color.component.scss'

})
export class KColorComponent {


  @Input()
  Question!: Question;



  colorValue = '#000000';



  updateColor(event:Event):void {


    const input =
      event.target as HTMLInputElement;


    this.colorValue =
      input.value;


  }


}