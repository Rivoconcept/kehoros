import {
  Directive,
  Input
} from '@angular/core';

import {
  FormControl
} from '@angular/forms';

import {
  Question
} from 'src/app/features/forms/models/question.model';



@Directive()

export abstract class BaseFieldComponent {



  @Input({ required:true })
  Question!: Question;



  @Input({ required:true })
  control!: FormControl;





  get invalid(): boolean {


    return !!this.control &&

      this.control.invalid &&

      (

        this.control.touched ||

        this.control.dirty

      );


  }






  get disabled(): boolean {


    return !!this.control &&

      this.control.disabled;


  }







  get required(): boolean {


    return this.Question?.required === true;


  }







  get readonly(): boolean {


    return this.Question?.readOnly === true;


  }







  get placeholder(): string {


    return this.Question?.placeholder ?? '';


  }







  get helpText(): string {


    return this.Question?.helpText ?? '';


  }







  get value(): any {


    return this.control?.value ?? null;


  }







  setValue(value:any):void {


    if(this.control){


      this.control.setValue(value);


      this.control.markAsDirty();


    }


  }







  hasError(error:string):boolean {


    return !!this.control &&

      this.control.hasError(error);


  }







  getErrorMessage():string | null {


    if(!this.invalid){


      return null;


    }






    if(this.hasError('required')){


      return 'This field is required.';


    }






    if(this.hasError('email')){


      return this.Question.errorMessage ??

        'Invalid email address.';


    }






    if(this.hasError('minlength')){


      return `Minimum ${this.Question.minLength} characters.`;


    }






    if(this.hasError('maxlength')){


      return `Maximum ${this.Question.maxLength} characters.`;


    }






    if(this.hasError('min')){


      return `Minimum value: ${this.Question.minValue}`;


    }






    if(this.hasError('max')){


      return `Maximum value: ${this.Question.maxValue}`;


    }






    if(this.hasError('pattern')){


      return this.Question.errorMessage ??

        'Invalid format.';


    }






    return 'Invalid value.';


  }



}