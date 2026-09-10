import { PartialType } from '@nestjs/mapped-types';
import { CreateTemplateDto } from './create-template.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { FormStatus } from '../enums/form-status.enum';

export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {
  @IsOptional()
  @IsEnum(FormStatus)
  status?: FormStatus;
}