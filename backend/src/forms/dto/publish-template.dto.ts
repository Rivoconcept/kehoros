import { IsEnum } from 'class-validator';
import { FormStatus } from '../enums/form-status.enum';

export class PublishTemplateDto {

  @IsEnum(FormStatus)
  status: FormStatus;

}