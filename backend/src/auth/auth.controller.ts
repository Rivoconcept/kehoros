import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginReq } from './requests/login.req';
import { RegisterReq } from './requests/register.req';
import { EmailCodeRequest } from './requests/email-code.req';
import { VerifyEmailCodeRequest } from './requests/verify-email-code.req';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() req: RegisterReq) {
    return this.authService.register(req);
  }

  @Post('login')
  login(@Body() req: LoginReq) {
    return this.authService.login(req);
  }

  @Post('email-code/request')
  requestEmailCode(@Body() req: EmailCodeRequest) {
    return this.authService.requestEmailCode(req.email);
  }

  @Post('email-code/verify')
  verifyEmailCode(@Body() req: VerifyEmailCodeRequest) {
    return this.authService.verifyEmailCode(req.email, req.code);
  }
}