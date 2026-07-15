import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterReq {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;
}