import {
  IsArray,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

class AnswerDto {

  @IsUUID()
  question_id: string;

  value: any;

}

export class SubmitFormDto {

  @IsUUID()
  response_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];

}