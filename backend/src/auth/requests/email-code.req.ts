import { IsEmail } from 'class-validator';

export class EmailCodeRequest {
  @IsEmail()
  email!: string;
}
