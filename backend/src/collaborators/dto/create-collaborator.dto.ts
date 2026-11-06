import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCollaboratorDto {
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  matricule: string;

  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  nom: string;

  @IsString()
  @IsOptional()
  prenoms?: string;

  @IsEmail()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.replace(/\u00a0/g, ' ').trim() : value,
  )
  email: string;

  @IsString()
  @IsOptional()
  fonction?: string;

  @IsString()
  @IsOptional()
  niveau?: string;

  @IsString()
  @IsOptional()
  pole?: string;

  @IsString()
  @IsOptional()
  departement?: string;

  @IsString()
  @IsOptional()
  manager?: string;

  @IsString()
  @IsOptional()
  supervisor?: string;

  @IsString()
  @IsOptional()
  pays?: string;

  @IsString()
  @IsOptional()
  equipeFr?: string;

  @IsString()
  @IsOptional()
  verticale?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === true || value === 'true' || value === 1 || value === '1') return true;
    if (typeof value === 'string' && value.trim().toLowerCase() === 'oui') return true;
    return false;
  })
  accesDrive?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === true || value === 'true' || value === 1 || value === '1') return true;
    if (typeof value === 'string' && value.trim().toLowerCase() === 'oui') return true;
    return false;
  })
  abilityDelegation?: boolean;

  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => (value && value.trim() !== '' ? value : null))
  delegatedMail?: string;

  @IsString()
  @IsOptional()
  noticed?: string;
}