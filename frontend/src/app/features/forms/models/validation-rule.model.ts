export type ValidationRuleType =

    | 'REQUIRED'
    | 'MIN_LENGTH'
    | 'MAX_LENGTH'
    | 'MIN_VALUE'
    | 'MAX_VALUE'
    | 'REGEX'
    | 'EMAIL'
    | 'PHONE'
    | 'URL'
    | 'DATE'
    | 'CUSTOM'
    | 'ASYNC';




export interface ValidationRule {


    /**
     * Identifiant unique de la règle
     */
    id:string;



    /**
     * Type de validation
     */
    type:ValidationRuleType;



    /**
     * Active ou désactive la règle
     */
    enabled:boolean;



    /**
     * Valeur utilisée par la règle
     *
     * Exemples:
     * MIN_LENGTH => 5
     * MAX_VALUE => 100
     * REGEX => pattern
     */
    value?:any;



    /**
     * Message personnalisé affiché à l'utilisateur
     */
    message?:string;



    /**
     * Ordre d'exécution
     */
    order?:number;



    /**
     * Validation au blur uniquement
     */
    validateOnBlur?:boolean;



    /**
     * Condition d'application de la règle
     *
     * Exemple:
     * Afficher une validation uniquement
     * si une autre question possède une valeur précise
     */
    condition?:{


        questionId:string;



        operator:

            | 'EQUAL'
            | 'NOT_EQUAL'
            | 'CONTAINS'
            | 'GREATER_THAN'
            | 'LESS_THAN';



        value:any;


    };



    /**
     * Données supplémentaires libres
     */
    metadata?:Record<string,any>;

}