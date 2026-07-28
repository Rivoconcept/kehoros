import { Question } from './question.model';

export interface Template {

  id:string;

  title:string;

  description:string;

  category:string;

  published:boolean;

  archived:boolean;

  version:number;

  questions:Question[];

  createdAt:Date;

  updatedAt:Date;

}