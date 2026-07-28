import { QuestionType } from '../enums/question-type.enum';

export interface QuestionInterface {

  id: string;

  title: string;

  description?: string;

  type: QuestionType;

  required: boolean;

  points: number;

  settings?: Record<string, any>;

}