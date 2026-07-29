import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuilderService } from '../../services/builder.service';

import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { QuestionType } from '../../../models/question-type.enum';



@Component({

  selector: 'app-question-preview',

  standalone:true,

  imports:[

    CommonModule,

    MatIconModule,

    MatRadioModule,

    MatCheckboxModule,

    MatSelectModule,

    MatInputModule,

    MatFormFieldModule

  ],

  templateUrl:'./question-preview.component.html',

  styleUrl:'./question-preview.component.scss'

})
export class QuestionPreviewComponent {


  QuestionType = QuestionType;



  constructor(
    public builder: BuilderService
  ){}



}