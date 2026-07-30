import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Question } from '../../../models/question.model';


@Component({

  selector:'app-k-location',

  standalone:true,

  imports:[

    CommonModule,

    FormsModule,

    MatInputModule,

    MatFormFieldModule

  ],

  templateUrl:'./k-location.component.html',

  styleUrl:'./k-location.component.scss'

})
export class KLocationComponent {


  @Input()
  Question!: Question;



  latitude:number =
    -18.8792;



  longitude:number =
    47.5079;



  updateLatitude(value:string){

    this.latitude =
      Number(value);

  }



  updateLongitude(value:string){

    this.longitude =
      Number(value);

  }



}