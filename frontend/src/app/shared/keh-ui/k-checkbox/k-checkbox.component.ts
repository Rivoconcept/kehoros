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
  MatCheckboxModule
} from '@angular/material/checkbox';


import {
  Question
} from '../../../features/forms/models/question.model';



@Component({

  selector:'app-k-checkbox',

  standalone:true,

  imports:[

    CommonModule,

    ReactiveFormsModule,

    MatCheckboxModule

  ],

  templateUrl:'./k-checkbox.component.html',

  styleUrl:'./k-checkbox.component.scss'

})
export class KCheckboxComponent implements OnInit {


  @Input()
  Question!: Question;



  @Input()
  control!: FormControl;







  ngOnInit():void {


    if(!this.control){


      this.control = new FormControl(

        this.Question.defaultValue ?? []

      );


    }


  }







  get values():string[] {


    return this.control.value ?? [];


  }








  toggle(
    value:string,
    checked:boolean
  ):void {


    let current = [

      ...this.values

    ];





    if(checked){


      if(!current.includes(value)){


        current.push(value);


      }


    }

    else {


      current = current.filter(

        v => v !== value

      );


    }





    this.control.setValue(current);

    this.control.markAsTouched();



    this.Question.defaultValue = current;



  }







  isChecked(value:string):boolean {


    return this.values.includes(value);


  }



}