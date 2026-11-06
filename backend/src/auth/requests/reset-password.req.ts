import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordRequest {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(128)
  code!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(128)
  newPassword!: string;
}
