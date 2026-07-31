import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Question } from '../../../features/forms/models/question.model';


@Component({

  selector:'app-k-file',

  standalone:true,

  imports:[

    CommonModule

  ],

  templateUrl:'./k-file.component.html',

  styleUrl:'./k-file.component.scss'

})
export class KFileComponent {


  @Input()
  Question!: Question;



  files: File[] = [];



  onFileChange(event:Event){


    const input = event.target as HTMLInputElement;


    if(!input.files){

      return;

    }



    this.files = Array.from(input.files);


  }



}