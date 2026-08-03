import { Answer } from "./answer.model";

export interface Response {

    id: string;

    sessionId: string;

    formId: string;

    answers: Answer[];

    totalScore?: number;

    submittedAt?: string;

    submittedBy?: string;

    status?:
        | 'DRAFT'
        | 'SUBMITTED'
        | 'VALIDATED'
        | 'REJECTED';

}