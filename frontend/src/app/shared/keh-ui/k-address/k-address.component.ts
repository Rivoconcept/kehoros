import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Question } from 'src/app/features/forms/models/question.model';


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



  errorMessage:string | null = null;



  ngOnInit():void {


    if(this.Question.defaultValue){

      this.address = {

        ...this.address,

        ...this.Question.defaultValue

      };

    }


  }





  get fields(){


    return this.Question.addressFields ?? {

      street:true,

      city:true,

      state:false,

      zip:true,

      country:true

    };


  }






  update():void {


    if(this.Question.trimValue){


      this.address = {

        street:this.address.street.trim(),

        city:this.address.city.trim(),

        state:this.address.state.trim(),

        zip:this.address.zip.trim(),

        country:this.address.country.trim()

      };


    }



    this.Question.defaultValue = {

      ...this.address

    };



    this.validate();


  }






  validate():void {


    this.errorMessage = null;



    if(

      this.Question.required &&

      !this.address.street &&

      !this.address.city &&

      !this.address.country

    ){

      this.errorMessage =
        'Address is required';

      return;

    }





    if(

      this.address.zip &&

      !/^[0-9A-Za-z -]{3,10}$/.test(

        this.address.zip

      )

    ){

      this.errorMessage =
        'Invalid zip code';

      return;

    }


  }






  onBlur():void {


    this.update();


  }


}