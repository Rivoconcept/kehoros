import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCheckboxModule } from '@angular/material/checkbox';

import { Question } from '../../../features/forms/models/question.model';


@Component({

  selector:'app-k-checkbox',

  standalone:true,

  imports:[

    CommonModule,

    FormsModule,

    MatCheckboxModule

  ],

  templateUrl:'./k-checkbox.component.html',

  styleUrl:'./k-checkbox.component.scss'

})
export class KCheckboxComponent {


  @Input()
  Question!: Question;



  values:string[] = [];



  toggle(value:string, checked:boolean){


    if(checked){

      this.values.push(value);

    }

    else {

      this.values =
        this.values.filter(v => v !== value);

    }


  }



  isChecked(value:string):boolean {

    return this.values.includes(value);

  }



}