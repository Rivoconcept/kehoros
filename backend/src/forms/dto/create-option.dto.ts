import {
  IsBoolean,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export class CreateOptionDto {

  @IsString()
  label: string;

  @IsString()
  value: string;

  @IsOptional()
  @IsBoolean()
  is_correct?: boolean;

  @IsOptional()
  @IsNumber()
  position?: number;

}