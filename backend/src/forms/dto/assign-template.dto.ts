import {
  IsUUID,
  IsArray,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class AssignTemplateDto {

  @IsUUID()
  template_id!: string;

  @IsOptional()
  @IsArray()
  user_ids?: string[];

  @IsOptional()
  @IsDateString()
  deadline?: string;

}