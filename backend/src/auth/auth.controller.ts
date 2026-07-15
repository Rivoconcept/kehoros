import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginReq } from './requests/login.req';
import { RegisterReq } from './requests/register.req';

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
}