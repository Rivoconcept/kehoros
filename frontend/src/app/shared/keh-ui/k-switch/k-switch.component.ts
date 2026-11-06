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
  MatSlideToggleModule
} from '@angular/material/slide-toggle';

import {
  FieldContainerComponent
} from '../core/field-container/field-container.component';

import {
  Question
} from '../../../features/forms/models/question.model';



@Component({
    selector: 'app-k-switch',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        FieldContainerComponent
    ],
    templateUrl: './k-switch.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrl: './k-switch.component.scss'
})
export class KSwitchComponent {


  @Input({required:true})
  Question!: Question;



  @Input({required:true})
  control!: FormControl;



}