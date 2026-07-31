import {
  Component,
  Input,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';


import {
  Question
} from '../../../features/forms/models/question.model';



@Component({

  selector:'app-k-barcode',

  standalone:true,

  imports:[

    CommonModule

  ],

  templateUrl:'./k-barcode.component.html',

  styleUrl:'./k-barcode.component.scss'

})
export class KBarcodeComponent implements OnInit {


  @Input()
  Question!: Question;



  bars:boolean[] = [];






  ngOnInit():void {


    this.generateBarcode();


  }






  get value():string {


    return this.Question.defaultValue ??

      '123456789';



  }








  generateBarcode():void {


    const text = this.value.toString();



    this.bars = [];




    for(const char of text){


      const code =

        char.charCodeAt(0)

          .toString(2)

          .padStart(8,'0');





      for(const bit of code){


        this.bars.push(

          bit === '1'

        );


      }


    }


  }





}