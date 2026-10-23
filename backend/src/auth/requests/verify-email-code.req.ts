import { IsEmail, Matches } from 'class-validator';

export class VerifyEmailCodeRequest {
  @IsEmail()
  email!: string;

  @Matches(/^\d{6}$/)
  code!: string;
}
