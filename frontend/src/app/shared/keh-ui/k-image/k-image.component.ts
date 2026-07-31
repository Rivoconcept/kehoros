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
  Question
} from '../../../features/forms/models/question.model';



@Component({

  selector:'app-k-image',

  standalone:true,

  imports:[

    CommonModule,

    ReactiveFormsModule

  ],

  templateUrl:'./k-image.component.html',

  styleUrl:'./k-image.component.scss'

})
export class KImageComponent {


  @Input({required:true})
  Question!: Question;



  @Input({required:true})
  control!: FormControl;



  previews:string[] = [];





  onImageChange(event:Event):void {


    const input = event.target as HTMLInputElement;



    if(!input.files){

      return;

    }




    this.previews = [];



    const files = Array.from(input.files);



    files.forEach(file => {


      const reader = new FileReader();



      reader.onload = () => {


        this.previews.push(
          reader.result as string
        );


      };



      reader.readAsDataURL(file);


    });




    this.control.setValue(files);


    this.control.markAsDirty();


    this.control.markAsTouched();


  }



}