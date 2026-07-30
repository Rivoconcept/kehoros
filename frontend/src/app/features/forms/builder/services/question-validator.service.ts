import { Injectable } from '@angular/core';
import { Question } from '../../models/question.model';


@Injectable({
  providedIn:'root'
})
export class QuestionValidatorService {


  constructor(){}





  validate(
    question:Question,
    value:any
  ):ValidationResult {



    // Valeur obligatoire

    if(
      question.required &&
      (
        value === null ||
        value === undefined ||
        value === ''
      )
    ){

      return {

        valid:false,

        message:
          question.errorMessage ??
          'This field is required'

      };

    }





    // Champ vide non obligatoire

    if(
      value === null ||
      value === undefined ||
      value === ''
    ){

      return {

        valid:true

      };

    }






    let result:ValidationResult = {

      valid:true

    };







    switch(question.validationType){


      case 'EMAIL':

        result =
          this.validateEmail(value);

        break;





      case 'PHONE':

        result =
          this.validatePhone(value);

        break;





      case 'URL':

        result =
          this.validateUrl(value);

        break;





      case 'NUMBER':

        result =
          this.validateNumber(
            question,
            value
          );

        break;





      case 'TEXT':

        result =
          this.validateText(
            question,
            value
          );

        break;





      case 'DATE':

        result =
          this.validateDate(
            question,
            value
          );

        break;





      case 'REGEX':

        result =
          this.validateRegex(
            question,
            value
          );

        break;


    }





    if(
      !result.valid &&
      question.errorMessage
    ){

      result.message =
        question.errorMessage;

    }



    return result;


  }









  private validateEmail(
    value:string
  ):ValidationResult {


    const regex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



    return {


      valid:
        regex.test(value),


      message:
        'Invalid email address'


    };


  }









  private validatePhone(
    value:string
  ):ValidationResult {


    const regex =
      /^\+?[0-9]{8,15}$/;



    return {


      valid:
        regex.test(
          value.replace(/\s/g,'')
        ),


      message:
        'Invalid phone number'


    };


  }









  private validateUrl(
    value:string
  ):ValidationResult {


    try{


      const url =
        new URL(value);



      return {


        valid:
          url.protocol === 'http:' ||
          url.protocol === 'https:',


        message:
          'Invalid URL'


      };


    }
    catch{


      return {

        valid:false,

        message:
          'Invalid URL'

      };


    }


  }









  private validateNumber(
    question:Question,
    value:any
  ):ValidationResult {


    const number =
      Number(value);



    if(isNaN(number)){


      return {


        valid:false,

        message:
          'Must be a number'


      };


    }





    if(
      question.minValue !== undefined &&
      number < question.minValue
    ){


      return {


        valid:false,

        message:
          `Minimum value is ${question.minValue}`


      };


    }






    if(
      question.maxValue !== undefined &&
      number > question.maxValue
    ){


      return {


        valid:false,

        message:
          `Maximum value is ${question.maxValue}`


      };


    }





    return {

      valid:true

    };


  }









  private validateText(
    question:Question,
    value:string
  ):ValidationResult {



    if(
      question.minLength &&
      value.length < question.minLength
    ){

      return {


        valid:false,


        message:
          `Minimum ${question.minLength} characters`


      };

    }






    if(
      question.maxLength &&
      value.length > question.maxLength
    ){

      return {


        valid:false,


        message:
          `Maximum ${question.maxLength} characters`


      };


    }





    return {

      valid:true

    };


  }









  private validateDate(
    question:Question,
    value:string
  ):ValidationResult {



    const date =
      new Date(value);





    if(
      question.minDate &&
      date < new Date(question.minDate)
    ){

      return {


        valid:false,


        message:
          'Date is too early'


      };


    }






    if(
      question.maxDate &&
      date > new Date(question.maxDate)
    ){

      return {


        valid:false,


        message:
          'Date is too late'


      };


    }





    return {

      valid:true

    };


  }









  private validateRegex(
    question:Question,
    value:string
  ):ValidationResult {



    if(!question.pattern){

      return {

        valid:true

      };

    }





    const regex =
      new RegExp(
        question.pattern
      );





    return {


      valid:
        regex.test(value),


      message:
        'Invalid format'


    };


  }



}





export interface ValidationResult {


  valid:boolean;


  message?:string;


}