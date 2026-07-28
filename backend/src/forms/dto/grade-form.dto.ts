import {
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GradeFormDto {

  @IsNumber()
  score: number;

  @IsOptional()
  @IsString()
  comment?: string;

}