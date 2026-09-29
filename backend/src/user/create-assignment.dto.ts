import { IsEnum, IsArray, IsOptional, IsString, IsNotEmpty, IsDateString } from 'class-validator';

export enum AssignmentType {
  ALL = 'ALL',
  DEPARTMENT = 'DEPARTMENT',
  INDIVIDUAL = 'INDIVIDUAL',
}

export class CreateAssignmentDto {
  @IsNotEmpty()
  @IsString()
  templateId: string;

  @IsEnum(AssignmentType)
  type: AssignmentType;

  // Requis si type === 'DEPARTMENT'
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  departmentIds?: string[];

  // Requis si type === 'INDIVIDUAL' (liste de matricules / registration numbers)
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  registrationNumbers?: string[];

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}