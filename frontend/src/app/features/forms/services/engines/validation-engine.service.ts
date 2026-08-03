import { Injectable } from '@angular/core';

import {
    AbstractControl,
    ValidationErrors,
    ValidatorFn,
    Validators
} from '@angular/forms';

import { ValidationRule } from '../../models/validation-rule.model';

import { CustomValidators } from './custom-validators';



@Injectable({
    providedIn:'root'
})
export class ValidationEngineService {



    buildValidators(
        rules:ValidationRule[] = []
    ):ValidatorFn[] {


        const validators:ValidatorFn[] = [];




        rules

        .filter(rule => rule.enabled)

        .sort(
            (a,b)=>
                (a.order ?? 0)
                -
                (b.order ?? 0)
        )

        .forEach(rule => {


            const validator =
                this.createValidator(rule);



            if(validator){

                validators.push(
                    validator
                );

            }


        });



        return validators;


    }









    private createValidator(
        rule:ValidationRule
    ):ValidatorFn|null {



        switch(rule.type){



            case 'REQUIRED':

                return Validators.required;







            case 'MIN_LENGTH':

                return Validators.minLength(
                    Number(rule.value)
                );







            case 'MAX_LENGTH':

                return Validators.maxLength(
                    Number(rule.value)
                );







            case 'MIN_VALUE':

                return Validators.min(
                    Number(rule.value)
                );







            case 'MAX_VALUE':

                return Validators.max(
                    Number(rule.value)
                );







            case 'REGEX':

                return CustomValidators.regex(
                    rule.value
                );







            case 'EMAIL':

                return CustomValidators.email();







            case 'PHONE':

                return CustomValidators.phone();







            case 'URL':

                return CustomValidators.url();







            case 'DATE':

                return this.date();







            case 'CUSTOM':

                return null;







            case 'ASYNC':

                return null;







            default:

                return null;


        }


    }









    private date():ValidatorFn {


        return (

            control:AbstractControl

        ):ValidationErrors|null => {



            if(!control.value){

                return null;

            }




            const value =
                new Date(control.value);



            return isNaN(
                value.getTime()
            )

                ? {
                    date:true
                }

                : null;


        };


    }



}