import {
  Component,
  Input
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';

import {
  MatInputModule
} from '@angular/material/input';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  Question
} from 'src/app/features/forms/models/question.model';



@Component({

  selector:'app-k-location',

  standalone:true,

  imports:[

    CommonModule,

    ReactiveFormsModule,

    MatInputModule,

    MatFormFieldModule,

    MatButtonModule

  ],

  templateUrl:'./k-location.component.html',

  styleUrl:'./k-location.component.scss'

})
export class KLocationComponent {


  @Input({required:true})
  Question!: Question;



  @Input({required:true})
  control!: FormControl;



  latitude = -18.8792;


  longitude = 47.5079;




  get errorMessage(): string | null {


    if(

      !this.control ||

      this.control.valid ||

      !this.control.touched

    ){

      return null;

    }



    if(this.control.hasError('required')){

      return 'Location is required';

    }



    return 'Invalid location';


  }






  ngOnInit():void {


    const value = this.control?.value;



    if(value){

      this.latitude =
        value.latitude ??
        this.latitude;


      this.longitude =
        value.longitude ??
        this.longitude;

    }



    this.updateValue();


  }






  updateValue():void {


    this.control.setValue({

      latitude:this.latitude,

      longitude:this.longitude

    });



    this.control.markAsDirty();


  }







  updateLatitude(value:string):void {


    this.latitude = Number(value);


    this.updateValue();


  }







  updateLongitude(value:string):void {


    this.longitude = Number(value);


    this.updateValue();


  }








  getCurrentLocation():void {


    if(!navigator.geolocation){

      return;

    }





    navigator.geolocation.getCurrentPosition(

      position => {


        this.latitude =
          position.coords.latitude;



        this.longitude =
          position.coords.longitude;



        this.updateValue();


      }

    );


  }


}