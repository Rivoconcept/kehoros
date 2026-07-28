export interface Assignment {

  id:string;

  templateId:string;

  userId:string;

  assignedBy:string;

  assignedAt:Date;

  deadline?:Date;

  completedAt?:Date;

  status:string;

}