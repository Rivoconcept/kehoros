import {
  Component,
  Input,
  OnInit
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
  Question
} from 'src/app/features/forms/models/question.model';


import {
  FieldErrorsComponent
} from '../core/field-errors/field-errors.component';



@Component({

  selector:'app-k-color',

  standalone:true,

  imports:[

    CommonModule,

    ReactiveFormsModule,

    MatInputModule,

    MatFormFieldModule,

    FieldErrorsComponent

  ],

  templateUrl:'./k-color.component.html',

  styleUrl:'./k-color.component.scss'

})
export class KColorComponent implements OnInit {



  @Input({required:true})
  Question!: Question;



  @Input({required:true})
  control!: FormControl;





  colorValue = '#000000';







  ngOnInit():void {


    this.colorValue =

      this.control.value ??

      this.Question.defaultValue ??

      '#000000';





    if(!this.control.value){


      this.control.setValue(

        this.colorValue,

        {
          emitEvent:false
        }

      );


    }


  }








  updateColor(event:Event):void {


    const input =

      event.target as HTMLInputElement;



    this.colorValue =

      input.value;



    this.updateValue();


  }








  updateText(value:string):void {


    this.colorValue = value;



    this.updateValue();


  }








  updateValue():void {


    this.control.setValue(

      this.colorValue

    );



    this.control.markAsDirty();



  }








}