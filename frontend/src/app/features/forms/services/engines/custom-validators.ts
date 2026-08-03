import {
    AbstractControl,
    ValidationErrors,
    ValidatorFn
} from '@angular/forms';



export class CustomValidators {



    /**
     * Validation regex personnalisée
     */
    static regex(
        pattern:string
    ):ValidatorFn {


        return (
            control:AbstractControl
        ):ValidationErrors|null => {


            if(!control.value){

                return null;

            }



            const regex = new RegExp(pattern);



            return regex.test(control.value)

                ? null

                : {
                    regex:true
                };


        };


    }






    /**
     * Validation téléphone
     */
    static phone():ValidatorFn {


        return (
            control:AbstractControl
        ):ValidationErrors|null => {


            if(!control.value){

                return null;

            }



            const phoneRegex =
                /^[+]?[0-9\s\-().]{7,20}$/;



            return phoneRegex.test(control.value)

                ? null

                : {
                    phone:true
                };


        };


    }







    /**
     * Validation email
     */
    static email():ValidatorFn {


        return (
            control:AbstractControl
        ):ValidationErrors|null => {


            if(!control.value){

                return null;

            }



            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



            return emailRegex.test(control.value)

                ? null

                : {
                    email:true
                };


        };


    }







    /**
     * Validation URL
     */
    static url():ValidatorFn {


        return (
            control:AbstractControl
        ):ValidationErrors|null => {


            if(!control.value){

                return null;

            }



            try {


                new URL(control.value);


                return null;


            }

            catch {


                return {
                    url:true
                };


            }


        };


    }







    /**
     * Validation valeur obligatoire personnalisée
     */
    static notEmpty():ValidatorFn {


        return (
            control:AbstractControl
        ):ValidationErrors|null => {


            return control.value !== null &&
                   control.value !== undefined &&
                   control.value !== ''

                ? null

                : {
                    empty:true
                };


        };


    }



}