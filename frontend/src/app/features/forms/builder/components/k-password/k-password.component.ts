import {
  Component,
  Input
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatFormFieldModule } 
from '@angular/material/form-field';

import { MatInputModule }
from '@angular/material/input';

import { MatIconModule }
from '@angular/material/icon';

import { MatButtonModule }
from '@angular/material/button';
import { Question } from '../../../models/question.model';



@Component({

  selector:'app-k-password',

  standalone:true,

  imports:[

    CommonModule,

    MatFormFieldModule,

    MatInputModule,

    MatIconModule,

    MatButtonModule

  ],

  templateUrl:'./k-password.component.html',

  styleUrl:'./k-password.component.scss'

})
export class KPasswordComponent {


  @Input()
  Question!:Question;



  hidePassword = true;



  togglePassword():void {

    this.hidePassword =
      !this.hidePassword;

  }



}