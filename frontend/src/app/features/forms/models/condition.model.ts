export interface Condition {


    id:string;


    sourceQuestionId:string;


    operator:
        | '=='
        | '!='
        | '>'
        | '<'
        | '>='
        | '<='
        | 'contains'
        | 'startsWith'
        | 'endsWith'
        | 'empty'
        | 'notEmpty';



    expectedValue?:any;



    action:
        | 'SHOW'
        | 'HIDE'
        | 'ENABLE'
        | 'DISABLE'
        | 'REQUIRE'
        | 'OPTIONAL';



    enabled?:boolean;



}






/**
 * Groupe de conditions
 *
 * Exemple :
 *
 * (Age > 18 AND Pays == France)
 *
 */
export interface ConditionGroup {


    logic:
        | 'AND'
        | 'OR';



    conditions:Condition[];



}