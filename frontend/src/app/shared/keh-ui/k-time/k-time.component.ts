import {
  Component,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatInputModule
} from '@angular/material/input';


import {
  Question
} from '../../../features/forms/models/question.model';
import { FieldContainerComponent } from '../core/field-container/field-container.component';



@Component({
    selector: 'app-k-time',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        FieldContainerComponent
    ],
    templateUrl: './k-time.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrl: './k-time.component.scss'
})
export class KTimeComponent {


  @Input({required:true})
  Question!: Question;



  @Input({required:true})
  control!: FormControl;


}