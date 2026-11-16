import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  Matches,
} from 'class-validator';

export class RegisterReq {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @MinLength(1)
  matricule!: string;

  @IsOptional()
  @IsString()
  @Matches(/^[+]?[\d\s\-().]{6,20}$/, {
    message: 'Numéro de téléphone invalide',
  })
  phone?: string;
}
