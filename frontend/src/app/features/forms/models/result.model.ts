export interface Result {


    id:string;


    sessionId:string;



    // ==========================
    // Evaluation
    // ==========================


    score?:number;


    maxScore?:number;


    percentage?:number;



    // ==========================
    // Validation
    // ==========================


    validated:boolean;


    validatedBy?:string;


    validatedAt?:string;



    // ==========================
    // Status
    // ==========================


    status?:
        | 'PENDING'
        | 'PASSED'
        | 'FAILED'
        | 'REVIEW';



    // ==========================
    // Metadata
    // ==========================


    metadata?:Record<string,any>;

}