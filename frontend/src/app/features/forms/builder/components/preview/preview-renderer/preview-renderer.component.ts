import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';

import { FormControl } from '@angular/forms';

import { Question } from '../../../../models/question.model';
import { QuestionType } from '../../../../models/question-type.enum';


import { KAddressComponent } from '../../k-address/k-address.component';
import { KLocationComponent } from '../../k-location/k-location.component';
import { KMapComponent } from '../../k-map/k-map.component';
import { KPasswordComponent } from '../../k-password/k-password.component';
import { KUrlComponent } from '../../k-url/k-url.component';
import { KColorComponent } from '../../k-color/k-color.component';
import { KRangeComponent } from '../../k-range/k-range.component';
import { KHiddenComponent } from '../../k-hidden/k-hidden.component';
import { KDividerComponent } from '../../k-divider/k-divider.component';
import { KHtmlComponent } from '../../k-html/k-html.component';
import { KLabelComponent } from '../../k-label/k-label.component';
import { KPhoneComponent } from '../../k-phone/k-phone.component';


import {
  QuestionValidatorService
} from '../../../services/question-validator.service';



@Component({

  selector:'app-preview-renderer',

  standalone:true,

  imports:[

    CommonModule,

    MatInputModule,

    MatFormFieldModule,

    MatSelectModule,

    MatRadioModule,

    MatCheckboxModule,

    MatSlideToggleModule,

    MatSliderModule,


    KPhoneComponent,

    KAddressComponent,

    KLocationComponent,

    KMapComponent,

    KPasswordComponent,

    KUrlComponent,

    KColorComponent,

    KRangeComponent,

    KHiddenComponent,

    KDividerComponent,

    KHtmlComponent,

    KLabelComponent

  ],

  templateUrl:'./preview-renderer.component.html',

  styleUrl:'./preview-renderer.component.scss'

})
export class PreviewRendererComponent {


  @Input()
  Question!:Question;



  @Input()
  control!:FormControl;



  QuestionType =
    QuestionType;



  errorMessage:string|null = null;





  constructor(
    private validator:QuestionValidatorService
  ){}





  validate(value:any):void {


    if(!this.Question)
      return;



    const result =
      this.validator.validate(
        this.Question,
        value
      );



    this.errorMessage =
      result.valid
        ? null
        : result.message ?? null;


  }






  onInput(event:Event):void {


    const input =
      event.target as HTMLInputElement;



    this.validate(
      input.value
    );


  }






  onBlur(event:Event):void {


    const input =
      event.target as HTMLInputElement;



    this.validate(
      input.value
    );


  }






  get minScale(){

    return this.Question.minScale ?? 1;

  }





  get maxScale(){

    return this.Question.maxScale ?? 10;

  }





  get step(){

    return this.Question.step ?? 1;

  }





  get defaultValue(){

    return this.Question.defaultValue ?? null;

  }





  isReadonly(){

    return this.Question.readOnly === true;

  }





  isRequired(){

    return this.Question.required === true;

  }





  getRatingStars(){


    const max =
      this.Question.maxScale ?? 5;



    return Array(max)

      .fill(0)

      .map(
        (_,index)=>index+1
      );


  }




}