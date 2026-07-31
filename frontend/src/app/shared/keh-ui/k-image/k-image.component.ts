import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Question } from '../../../features/forms/models/question.model';


@Component({

  selector:'app-k-image',

  standalone:true,

  imports:[

    CommonModule

  ],

  templateUrl:'./k-image.component.html',

  styleUrl:'./k-image.component.scss'

})
export class KImageComponent {


  @Input()
  Question!: Question;



  images: string[] = [];



  onImageChange(event:Event){


    const input =
      event.target as HTMLInputElement;



    if(!input.files){

      return;

    }



    this.images = [];



    Array.from(input.files).forEach(file => {


      const reader = new FileReader();


      reader.onload = () => {


        this.images.push(
          reader.result as string
        );


      };


      reader.readAsDataURL(file);


    });


  }



}