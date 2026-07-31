import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Question } from '../../../features/forms/models/question.model';


@Component({

  selector:'app-k-barcode',

  standalone:true,

  imports:[

    CommonModule

  ],

  templateUrl:'./k-barcode.component.html',

  styleUrl:'./k-barcode.component.scss'

})
export class KBarcodeComponent {

    
    @Input()
    Question!: Question;
    
    bars:number[] = [];


    get value(){

    return this.Question.defaultValue ?? '123456789';

    }


}