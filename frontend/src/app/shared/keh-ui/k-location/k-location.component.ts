import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Question } from 'src/app/features/forms/models/question.model';


@Component({

  selector:'app-k-location',

  standalone:true,

  imports:[

    CommonModule,

    FormsModule,

    MatInputModule,

    MatFormFieldModule,

    MatButtonModule

  ],

  templateUrl:'./k-location.component.html',

  styleUrl:'./k-location.component.scss'

})
export class KLocationComponent {


  @Input()
  Question!: Question;



  latitude:number = -18.8792;


  longitude:number = 47.5079;


  errorMessage:string | null = null;





  ngOnInit():void {


    if(this.Question.defaultValue){

      this.latitude =
        this.Question.defaultValue.latitude ??
        this.latitude;


      this.longitude =
        this.Question.defaultValue.longitude ??
        this.longitude;


    }


    this.updateValue();


  }






  updateLatitude(value:string):void {


    this.latitude =
      Number(value);


    this.updateValue();


  }







  updateLongitude(value:string):void {


    this.longitude =
      Number(value);


    this.updateValue();


  }







  updateValue():void {


    this.Question.defaultValue = {


      latitude:this.latitude,


      longitude:this.longitude


    };


    this.validate();


  }







  validate():void {


    this.errorMessage = null;



    if(

      this.Question.required &&

      (
        this.latitude === null ||
        this.longitude === null
      )

    ){

      this.errorMessage =
        'Location is required';

      return;

    }






    if(

      this.latitude < -90 ||

      this.latitude > 90

    ){

      this.errorMessage =
        'Latitude must be between -90 and 90';

      return;

    }







    if(

      this.longitude < -180 ||

      this.longitude > 180

    ){

      this.errorMessage =
        'Longitude must be between -180 and 180';

      return;

    }


  }







  getCurrentLocation():void {


    if(

      !navigator.geolocation

    ){

      this.errorMessage =
        'Geolocation not supported';

      return;

    }





    navigator.geolocation.getCurrentPosition(

      position => {


        this.latitude =
          position.coords.latitude;


        this.longitude =
          position.coords.longitude;


        this.updateValue();


      },


      () => {


        this.errorMessage =
          'Unable to get your location';


      }

    );


  }



}