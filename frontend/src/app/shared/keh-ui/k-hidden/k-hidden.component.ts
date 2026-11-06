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
  Question
} from 'src/app/features/forms/models/question.model';



@Component({
    selector: 'app-k-hidden',
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: './k-hidden.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrl: './k-hidden.component.scss'
})
export class KHiddenComponent {


  @Input({required:true})
  Question!: Question;



  @Input({required:true})
  control!: FormControl;



  get name(): string {


    return this.Question?.title ?? 'hidden';


  }



}