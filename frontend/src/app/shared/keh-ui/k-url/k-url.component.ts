import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Question } from 'src/app/features/forms/models/question.model';
import { QuestionValidatorService } from 'src/app/features/forms/builder/services/question-validator.service';


@Component({

  selector:'app-k-url',

  standalone:true,

  imports:[

    CommonModule,

    FormsModule,

    MatInputModule,

    MatFormFieldModule

  ],

  templateUrl:'./k-url.component.html',

  styleUrl:'./k-url.component.scss'

})
export class KUrlComponent {

  @Input()
  Question!: Question;

  urlValue = '';

  errorMessage: string | null = null;

  constructor(
    private validator: QuestionValidatorService
  ) {}

  onInput(): void {

    if(this.Question.trimValue){

      this.urlValue =
        this.urlValue.trim();

    }

    this.validate();

  }

  onBlur(): void {

    if(
      this.urlValue &&
      !/^https?:\/\//i.test(this.urlValue)
    ){

      this.urlValue =
        'https://' + this.urlValue;

    }

    this.validate();

  }

  validate(): void {

    const result =
      this.validator.validate(
        this.Question,
        this.urlValue
      );

    this.errorMessage =
      result.valid
        ? null
        : result.message ?? null;

  }

  openLink(): void {

    if(this.errorMessage){

      return;

    }

    if(!this.urlValue){

      return;

    }

    window.open(

      this.urlValue,

      this.Question.openInNewTab === false
        ? '_self'
        : '_blank'

    );

  }

}