import {
  Component,
  Input
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormControl
} from '@angular/forms';

import {
  Question
} from 'src/app/features/forms/models/question.model';



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


  @Input({required:true})
  Question!: Question;



  /**
   * Présent uniquement pour uniformiser
   * l'API des composants keh-ui.
   * Divider n'utilise pas de FormControl.
   */
  @Input()
  control?: FormControl;




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