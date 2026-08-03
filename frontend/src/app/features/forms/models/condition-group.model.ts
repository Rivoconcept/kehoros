import { Condition } from './condition.model';


export interface ConditionGroup {


    id:string;


    operator:
        | 'AND'
        | 'OR';


    conditions:Condition[];


}