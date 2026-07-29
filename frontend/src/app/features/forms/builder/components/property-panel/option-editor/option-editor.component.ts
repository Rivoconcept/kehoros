import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { QuestionOption } from '../../../../models/question-option.model';



@Component({

  selector: 'app-option-editor',

  standalone: true,

  imports: [

    CommonModule,

    FormsModule,

    MatFormFieldModule,

    MatInputModule,

    MatIconModule,

    MatButtonModule

  ],

  templateUrl: './option-editor.component.html',

  styleUrl: './option-editor.component.scss'

})


export class OptionEditorComponent {


  @Input()
  options: QuestionOption[] = [];



  @Output()
  optionsChange =
    new EventEmitter<QuestionOption[]>();




  updateLabel(
    index:number,
    value:string
  ){


    const option = this.options[index];


    if(!option)
      return;



    option.label = value;


    option.value =
      value
        .toLowerCase()
        .trim()
        .replace(/\s+/g,'-');



    this.emit();


  }






  add(){


    this.options.push({

      id: crypto.randomUUID(),

      label:'Nouvelle option',

      value:`option-${this.options.length + 1}`,

      order:this.options.length

    });



    this.emit();


  }






  remove(index:number){


    this.options.splice(index,1);



    this.options.forEach(
      (option,i)=>{

        option.order=i;

      }
    );



    this.emit();


  }





  private emit(){

    this.optionsChange.emit(
      [...this.options]
    );

  }


}