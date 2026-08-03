import { QuestionType } from './question-type.enum';
import { QuestionOption } from './question-option.model';
import { ValidationRule } from './validation-rule.model';
import { Condition } from './condition.model';
import { ConditionGroup } from './condition-group.model';



export interface Question {


    id:string;


    templateId:string;


    title:string;


    description?:string;


    type:QuestionType;


    required:boolean;


    placeholder?:string;


    helpText?:string;


    order:number;


    score?:number;


    options:QuestionOption[];





    // ==========================
    // Conditions dynamiques
    // ==========================


    /**
     * Conditions simples
     *
     * Exemple :
     *
     * Age > 18
     */
    conditions?:Condition[];




    /**
     * Groupes de conditions multiples
     *
     * Exemple :
     *
     * (
     *   Age > 18
     *   AND
     *   Pays == France
     * )
     *
     */
    conditionGroups?:ConditionGroup[];





    // ==========================
    // Validation
    // ==========================


    minLength?:number;


    maxLength?:number;


    minValue?:number;


    maxValue?:number;


    pattern?:string;





    // ==========================
    // Validation avancée
    // ==========================


    validationType?:
        | 'TEXT'
        | 'EMAIL'
        | 'PHONE'
        | 'URL'
        | 'NUMBER'
        | 'DATE'
        | 'PASSWORD'
        | 'REGEX';



    errorMessage?:string;


    trimValue?:boolean;


    validateOnBlur?:boolean;





    // ==========================
    // Advanced Validation Rules
    // ==========================


    validationRules?:ValidationRule[];





    // ==========================
    // Compatibilité ancienne logique
    // ==========================


    conditional?:boolean;


    dependsOnQuestionId?:string;


    expectedValue?:any;





    // ==========================
    // Default value
    // ==========================


    defaultValue?:any;





    // ==========================
    // UI / Appearance
    // ==========================


    icon?:string;


    color?:string;


    width?:
        | '25%'
        | '33%'
        | '50%'
        | '66%'
        | '75%'
        | '100%';


    cssClass?:string;





    // ==========================
    // Visibility
    // ==========================


    hidden?:boolean;


    readOnly?:boolean;


    disabled?:boolean;





    // ==========================
    // File Upload
    // ==========================


    acceptedFileTypes?:string[];


    maxFileSize?:number;


    multipleFiles?:boolean;





    // ==========================
    // Rating / Scale / Range
    // ==========================


    minScale?:number;


    maxScale?:number;


    step?:number;


    rangeMin?:number;


    rangeMax?:number;


    rangeStep?:number;





    // ==========================
    // Phone
    // ==========================


    countryCode?:string;


    phoneFormat?:string;





    // ==========================
    // Address
    // ==========================


    addressFields?:{


        street?:boolean;


        city?:boolean;


        state?:boolean;


        zip?:boolean;


        country?:boolean;


    };





    // ==========================
    // Location / Map
    // ==========================


    latitude?:number;


    longitude?:number;


    zoom?:number;


    mapProvider?:
        | 'google'
        | 'openstreetmap';





    // ==========================
    // Date options
    // ==========================


    minDate?:string;


    maxDate?:string;


    allowPastDate?:boolean;


    allowFutureDate?:boolean;





    // ==========================
    // URL
    // ==========================


    openInNewTab?:boolean;





    // ==========================
    // Color
    // ==========================


    colorFormat?:
        | 'hex'
        | 'rgb'
        | 'hsl';





    // ==========================
    // HTML / Label
    // ==========================


    htmlContent?:string;


    labelStyle?:string;





    // ==========================
    // AI
    // ==========================


    aiPrompt?:string;


    aiValidation?:boolean;





    // ==========================
    // Metadata
    // ==========================


    tags?:string[];


    metadata?:Record<string,any>;



}