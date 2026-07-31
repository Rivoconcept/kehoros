import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Question } from '../../../features/forms/models/question.model';

import { FormControl } from "@angular/forms";

@Component({

  selector:'app-k-textarea',

  standalone:true,

  imports:[

    CommonModule,

    FormsModule,

    MatFormFieldModule,

    MatInputModule

  ],

  templateUrl:'./k-textarea.component.html',

  styleUrl:'./k-textarea.component.scss'

})
export class KTextareaComponent {


    @Input()
    Question!: Question;


    @Input()
    control!: FormControl;
    value = '';



}