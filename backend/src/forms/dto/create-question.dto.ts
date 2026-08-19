import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

import { QuestionType } from '../enums/question-type.enum';

export class CreateQuestionDto {
  @IsUUID()
  template_id: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  position?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  points?: number;

  /**
   * Toutes les propriétés avancées du modèle Question frontend.
   *
   * Elles sont volontairement regroupées dans settings
   * afin de conserver la flexibilité du builder.
   */
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}

