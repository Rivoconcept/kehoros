import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Question } from 'src/app/features/forms/models/question.model';



@Component({

  selector:'app-k-phone',

  standalone:true,

  imports:[

    CommonModule,

    FormsModule,

    MatFormFieldModule,

    MatInputModule,

    MatSelectModule

  ],

  templateUrl:'./k-phone.component.html',

  styleUrl:'./k-phone.component.scss'

})
export class KPhoneComponent {


  @Input()
  Question!: Question;



  phoneValue = '';



  selectedCountry = '+261';



  errorMessage:string | null = null;





  countries = [


    {
      code:'+261',
      name:'Madagascar'
    },


    {
      code:'+33',
      name:'France'
    },


    {
      code:'+1',
      name:'USA'
    },


    {
      code:'+44',
      name:'UK'
    },


    {
      code:'+49',
      name:'Germany'
    },


    {
      code:'+81',
      name:'Japan'
    }


  ];







  ngOnInit():void {


    this.selectedCountry =

      this.Question.countryCode ??

      '+261';




    this.phoneValue =

      this.Question.defaultValue ??

      '';



  }







  updateCountry(code:string):void {


    this.selectedCountry = code;


    this.Question.countryCode = code;


    this.updateValue();


  }







  updatePhone(value:string):void {


    this.phoneValue = value;


    this.updateValue();


  }







  updateValue():void {


    this.Question.defaultValue =

      this.selectedCountry +

      this.phoneValue;



    this.validate();


  }







  validate():void {


    this.errorMessage = null;





    if(

      this.Question.required &&

      !this.phoneValue

    ){

      this.errorMessage =
        'Phone number is required';

      return;

    }






    if(!this.phoneValue){

      return;

    }






    const phone =

      this.phoneValue.replace(

        /\s/g,

        ''

      );






    let regex =

      /^\d{6,15}$/;





    if(this.Question.phoneFormat){


      regex =

        new RegExp(

          this.Question.phoneFormat

        );

    }







    if(!regex.test(phone)){


      this.errorMessage =

        'Invalid phone number';


    }


  }





}