import { QuestionType } from './question-type.enum';
import { QuestionOption } from './question-option.model';


export interface Question {

    id: string;

    templateId: string;

    title: string;

    description: string;

    type: QuestionType;

    required: boolean;

    placeholder?: string;

    helpText?: string;

    order: number;

    score: number;

    options: QuestionOption[];

}