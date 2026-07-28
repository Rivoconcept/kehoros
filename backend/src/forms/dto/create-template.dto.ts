import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateTemplateDto {

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsBoolean()
  is_public?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  duration_minutes?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  pass_score?: number;

}