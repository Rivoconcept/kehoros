import {
  Component,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Question
} from '../../../features/forms/models/question.model';


@Component({
    selector: 'app-k-qr',
    imports: [
        CommonModule
    ],
    templateUrl: './k-qr.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrl: './k-qr.component.scss'
})
export class KQrComponent {


  @Input({required:true})
  Question!: Question;





  get value(): string {


    return (

      this.Question?.defaultValue ??

      ''

    );


  }



}