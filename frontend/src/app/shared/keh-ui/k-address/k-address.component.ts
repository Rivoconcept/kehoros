import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ReactiveFormsModule
} from '@angular/forms';

import {
  MatInputModule
} from '@angular/material/input';

import {
  MatFormFieldModule
} from '@angular/material/form-field';


import {
  BaseFieldComponent
} from '../core/base-field/base-field.component';


import {
  FieldErrorsComponent
} from '../core/field-errors/field-errors.component';



@Component({

  selector:'app-k-address',

  standalone:true,

  imports:[

    CommonModule,

    ReactiveFormsModule,

    MatInputModule,

    MatFormFieldModule,

    FieldErrorsComponent

  ],

  templateUrl:'./k-address.component.html',

  styleUrl:'./k-address.component.scss'

})
export class KAddressComponent 
extends BaseFieldComponent
implements OnInit {



  address = {

    street:'',
    city:'',
    state:'',
    zip:'',
    country:''

  };




  ngOnInit():void {


    if(this.control.value){

      this.address = {

        ...this.address,

        ...this.control.value

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







  update(){


    let value = {

      ...this.address

    };



    if(this.Question.trimValue){


      value = {

        street:value.street.trim(),

        city:value.city.trim(),

        state:value.state.trim(),

        zip:value.zip.trim(),

        country:value.country.trim()

      };


    }



    this.address = value;



    this.control.setValue(value);


    this.control.markAsDirty();


  }






  onChange(
    field:keyof typeof this.address,
    event:Event
  ){


    const input =
      event.target as HTMLInputElement;



    this.address[field] =
      input.value;



    this.update();


  }






  onBlur(){


    this.update();


    this.control.markAsTouched();


  }



}