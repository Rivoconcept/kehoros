import { Question } from './question.model';


export interface Template {


    id:string;


    title:string;


    description:string;


    category?:string;



    // ==========================
    // Status
    // ==========================


    published:boolean;


    archived:boolean;


    version:number;



    status?:
        | 'DRAFT'
        | 'PUBLISHED'
        | 'ARCHIVED';





    // ==========================
    // Form structure
    // ==========================


    questions:Question[];





    // ==========================
    // Display / UI
    // ==========================


    theme?: {

        primaryColor?:string;

        logo?:string;

        cssClass?:string;

    };



    showProgressBar?:boolean;


    allowSaveDraft?:boolean;


    allowMultipleSubmission?:boolean;





    // ==========================
    // Access
    // ==========================


    publicAccess?:boolean;


    requiresAuthentication?:boolean;





    // ==========================
    // Metadata
    // ==========================


    tags?:string[];


    metadata?:Record<string,any>;





    // ==========================
    // Dates
    // ==========================


    createdAt:Date;


    updatedAt:Date;


}