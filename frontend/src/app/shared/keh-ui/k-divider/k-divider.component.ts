import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from 'src/app/features/forms/models/question.model';



@Component({

  selector:'app-k-divider',

  standalone:true,

  imports:[

    CommonModule

  ],

  templateUrl:'./k-divider.component.html',

  styleUrl:'./k-divider.component.scss'

})
export class KDividerComponent {


  @Input()
  Question!: Question;





  get color(): string {


    return this.Question?.color ?? '#ddd';


  }





  get width(): string {


    return this.Question?.width ?? '100%';


  }





  get cssClass(): string {


    return this.Question?.cssClass ?? '';


  }





  get style(): string {


    return this.Question?.labelStyle ?? '';


  }



}