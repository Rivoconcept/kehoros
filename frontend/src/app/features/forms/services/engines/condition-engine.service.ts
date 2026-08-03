
import { Injectable } from '@angular/core';

import { FormGroup } from '@angular/forms';

import { Condition } from '../../models/condition.model';
import { ConditionGroup } from '../../models/condition-group.model';
import { Question } from '../../models/question.model';



export interface QuestionConditionState {

    visible:boolean;

    disabled:boolean;

    required:boolean;

}





@Injectable({
    providedIn:'root'
})
export class ConditionEngineService {





    /**
     * Vérifie une condition simple
     */
    evaluate(
        condition:Condition,
        form:FormGroup
    ):boolean {


        if(condition.enabled === false){

            return false;

        }



        const control =

            form.get(
                condition.sourceQuestionId
            );



        if(!control){

            return false;

        }



        return this.compare(

            control.value,

            condition.operator,

            condition.expectedValue

        );


    }









    /**
     * Vérifie une question complète
     */
    evaluateQuestion(
        question:Question,
        form:FormGroup
    ):boolean {


        return this.getQuestionState(
            question,
            form
        ).visible;


    }









    /**
     * Retourne l'état final d'une question
     */
    getQuestionState(
        question:Question,
        form:FormGroup
    ):QuestionConditionState {



        const state:QuestionConditionState = {


            visible:true,


            disabled:

                question.disabled ?? false,


            required:

                question.required ?? false


        };







        /**
         * Anciennes conditions simples
         */
        if(
            question.conditions &&
            question.conditions.length > 0
        ){


            question.conditions.forEach(condition=>{


                if(
                    this.evaluate(
                        condition,
                        form
                    )
                ){

                    this.applyAction(
                        state,
                        condition.action
                    );

                }


            });


        }







        /**
         * Groupes AND / OR
         */
        if(
            question.conditionGroups &&
            question.conditionGroups.length > 0
        ){


            question.conditionGroups.forEach(group=>{



                const valid =

                    this.evaluateGroup(
                        group,
                        form
                    );



                if(valid){


                    group.conditions.forEach(condition=>{


                        this.applyAction(

                            state,

                            condition.action

                        );


                    });


                }


            });


        }






        return state;


    }









    /**
     * Evaluation groupe de conditions
     */
    private evaluateGroup(

        group:ConditionGroup,

        form:FormGroup

    ):boolean {



        if(
            !group.conditions ||
            group.conditions.length === 0
        ){

            return false;

        }





        const results =

            group.conditions.map(condition=>

                this.evaluate(
                    condition,
                    form
                )

            );







        switch(group.operator){



            case 'AND':


                return results.every(
                    result=>result === true
                );





            case 'OR':


                return results.some(
                    result=>result === true
                );





            default:


                return false;


        }


    }









    /**
     * Application des actions
     */
    private applyAction(

        state:QuestionConditionState,

        action:Condition['action']

    ):void {



        switch(action){



            case 'SHOW':

                state.visible = true;

            break;



            case 'HIDE':

                state.visible = false;

            break;



            case 'ENABLE':

                state.disabled = false;

            break;



            case 'DISABLE':

                state.disabled = true;

            break;



            case 'REQUIRE':

                state.required = true;

            break;



            case 'OPTIONAL':

                state.required = false;

            break;


        }


    }









    /**
     * Comparaison des valeurs
     */
    private compare(

        value:any,

        operator:Condition['operator'],

        expected:any

    ):boolean {



        switch(operator){



            case '==':

                return value == expected;



            case '!=':

                return value != expected;



            case '>':

                return Number(value) > Number(expected);



            case '<':

                return Number(value) < Number(expected);



            case '>=':

                return Number(value) >= Number(expected);



            case '<=':

                return Number(value) <= Number(expected);





            case 'contains':


                if(Array.isArray(value)){


                    return value.includes(expected);


                }


                return String(value ?? '')
                    .includes(
                        String(expected)
                    );





            case 'startsWith':


                return String(value ?? '')
                    .startsWith(
                        String(expected)
                    );





            case 'endsWith':


                return String(value ?? '')
                    .endsWith(
                        String(expected)
                    );





            case 'empty':


                return (

                    value === null ||

                    value === undefined ||

                    value === ''

                );





            case 'notEmpty':


                return (

                    value !== null &&

                    value !== undefined &&

                    value !== ''

                );





            default:


                return false;


        }


    }



}