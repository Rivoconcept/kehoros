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

  selector:'app-k-file',

  standalone:true,

  imports:[

    CommonModule,

    ReactiveFormsModule

  ],

  templateUrl:'./k-file.component.html',

  styleUrl:'./k-file.component.scss'

})
export class KFileComponent {


  @Input({required:true})
  Question!: Question;



  @Input({required:true})
  control!: FormControl;



  get files(): File[] {


    return this.control?.value ?? [];


  }





  onFileChange(event:Event):void {


    const input = event.target as HTMLInputElement;



    if(!input.files){

      this.control.setValue([]);

      return;

    }





    const selectedFiles = Array.from(
      input.files
    );





    this.control.setValue(
      selectedFiles
    );



    this.control.markAsDirty();

    this.control.markAsTouched();


  }





  removeFile(file:File):void {


    const updatedFiles = this.files.filter(

      f => f !== file

    );



    this.control.setValue(
      updatedFiles
    );


  }



}