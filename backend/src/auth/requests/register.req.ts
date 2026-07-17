import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  Matches,
  IsUUID,
} from 'class-validator';

export class RegisterReq {

  @IsString()
  first_name!: string;

  @IsString()
  last_name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsString()
  matricule?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[+]?[\d\s\-().]{6,20}$/, {
    message: 'Numéro de téléphone invalide',
  })
  phone?: string;

  @IsOptional()
  @IsUUID()
  manager_id?: string;

  @IsOptional()
  @IsUUID()
  department_id?: string;
}

