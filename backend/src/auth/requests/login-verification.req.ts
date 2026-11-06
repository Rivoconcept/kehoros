import { IsIn, IsString, Length, Matches, MaxLength, MinLength } from 'class-validator';

export class LoginVerificationRequest {
  @IsString()
  @Length(36, 36)
  @Matches(/^[0-9a-f-]{36}$/i)
  challengeId!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(128)
  code!: string;

  @IsIn(['email', 'recovery'])
  method!: 'email' | 'recovery';
}
