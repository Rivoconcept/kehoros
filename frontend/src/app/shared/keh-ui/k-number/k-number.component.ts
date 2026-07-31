import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Question } from '../../../features/forms/models/question.model';

import { FormControl } from "@angular/forms";

@Component({

  selector:'app-k-number',

  standalone:true,

  imports:[

    CommonModule,

    FormsModule,

    MatFormFieldModule,

    MatInputModule

  ],

  templateUrl:'./k-number.component.html',

  styleUrl:'./k-number.component.scss'

})
export class KNumberComponent {


    @Input()
    Question!: Question;

    @Input()
    control!: FormControl;

    value:number | null = null;



}