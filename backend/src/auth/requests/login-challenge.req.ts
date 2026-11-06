import { IsString, Length, Matches } from 'class-validator';

export class LoginChallengeRequest {
  @IsString()
  @Length(36, 36)
  @Matches(/^[0-9a-f-]{36}$/i)
  challengeId!: string;
}
