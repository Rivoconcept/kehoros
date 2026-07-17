import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {

  @IsOptional()
  @IsString()
  matricule?: string;

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  manager_id?: string;

  @IsOptional()
  @IsString()
  department_id?: string;

}