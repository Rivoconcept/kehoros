import { Question } from "./question.model";


export interface Template {

    id:string;


    title:string;


    description:string;


    category?:string;



    // Status

    published:boolean;


    archived:boolean;


    version:number;


    status?:
        | 'DRAFT'
        | 'PUBLISHED'
        | 'ARCHIVED';



    // Structure formulaire

    questions: Question[];




    // Apparence

    theme?: {

        primaryColor?:string;

        logo?:string;

        cssClass?:string;

    };



    showProgressBar?:boolean;


    allowSaveDraft?:boolean;


    allowMultipleSubmission?:boolean;




    // Accès

    publicAccess?:boolean;


    requiresAuthentication?:boolean;




    // Métadonnées

    tags?:string[];


    metadata?:Record<string, any>;




    // Dates

    createdAt:Date;


    updatedAt:Date;


}