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
  FieldContainerComponent
} from '../core/field-container/field-container.component';

import {
  Question
} from '../../../features/forms/models/question.model';



@Component({
    selector: 'app-k-textarea',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        FieldContainerComponent
    ],
    templateUrl: './k-textarea.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrl: './k-textarea.component.scss'
})
export class KTextareaComponent {


  @Input({required:true})
  Question!: Question;



  @Input({required:true})
  control!: FormControl;



}