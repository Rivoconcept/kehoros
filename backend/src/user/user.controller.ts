import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getUsers() {
    return this.userService.getUsers();
  }

  @Post()
  create() {
    return 'This will create a property';
  }

}
