import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';

import { LoginReq } from './requests/login.req';
import { RegisterReq } from './requests/register.req';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterReq) {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already used');

    const password_hash = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.create({
      email: dto.email,
      password_hash,
      first_name: dto.first_name,
      last_name: dto.last_name,
      manager_id: dto.manager_id,
      department_id: dto.department_id,
    });
    
    return this.signToken(user);
  }

  async login(dto: LoginReq) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    console.log('User found, comparing password...');
    
    try {
      const valid = await bcrypt.compare(dto.password, user.password_hash);
      console.log('Password valid:', valid);
      if (!valid) throw new UnauthorizedException('Invalid credentials');
    } catch (err) {
      console.error('bcrypt error:', err);
      throw err;
    }

    if (!user.is_active) throw new UnauthorizedException('Account disabled');

    return this.signToken(user);
  }

  private signToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    };
  }
}