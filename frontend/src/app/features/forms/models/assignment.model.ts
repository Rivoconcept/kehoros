export interface Assignment {


    id:string;



    // Formulaire concerné
    templateId:string;



    // Utilisateur qui doit remplir le formulaire
    userId:string;



    // Utilisateur qui a créé l'attribution
    assignedBy:string;



    // Dates
    assignedAt:Date;


    deadline?:Date;


    completedAt?:Date;





    // ==========================
    // Status
    // ==========================


    status:
        | 'PENDING'
        | 'IN_PROGRESS'
        | 'COMPLETED'
        | 'EXPIRED'
        | 'CANCELLED';





    // ==========================
    // Progression
    // ==========================


    progress?:number;


    lastActivityAt?:Date;





    // ==========================
    // Metadata
    // ==========================


    metadata?:Record<string,any>;

}