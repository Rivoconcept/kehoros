import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Question } from '../../../models/question.model';


@Component({

  selector:'app-k-address',

  standalone:true,

  imports:[

    CommonModule,

    FormsModule,

    MatInputModule,

    MatFormFieldModule

  ],

  templateUrl:'./k-address.component.html',

  styleUrl:'./k-address.component.scss'

})
export class KAddressComponent {


  @Input()
  Question!: Question;



  address = {


    street:'',


    city:'',


    state:'',


    zip:'',


    country:''


  };





  get fields(){


    return this.Question.addressFields ?? {

      street:true,

      city:true,

      state:false,

      zip:true,

      country:true

    };


  }



}