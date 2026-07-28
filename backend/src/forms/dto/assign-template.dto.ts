import {
  IsUUID,
  IsArray,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class AssignTemplateDto {

  @IsUUID()
  template_id: string;

  @IsArray()
  user_ids: string[];

  @IsOptional()
  @IsDateString()
  deadline?: string;

}