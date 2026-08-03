export interface ValidationRule {


    id:string;


    questionId:string;



    type:
        | 'REQUIRED'
        | 'MIN_LENGTH'
        | 'MAX_LENGTH'
        | 'MIN_VALUE'
        | 'MAX_VALUE'
        | 'REGEX'
        | 'EMAIL'
        | 'PHONE'
        | 'URL'
        | 'CUSTOM';



    value?:any;



    message:string;



    enabled:boolean;



}