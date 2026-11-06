import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

import { UserService } from './user.service';

import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeUserPasswordDto } from './dto/change-user-password.dto';
import { UpdateTwoFactorDto } from './dto/update-two-factor.dto';

@Controller('users')
export class UserController {

  constructor(
    private readonly userService: UserService,
  ) {}

  @Get('managers')
  async getManagers() {
    return this.userService.getManagers();
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getUsers() {
    return this.userService.getUsers();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, dto);
  }

  @Post(':id/recovery-code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async generateRecoveryCode(@Param('id') id: string) {
    return { code: await this.userService.generateRecoveryCode(id) };
  }

  @Patch(':id/password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async changePassword(
    @Param('id') id: string,
    @Body() dto: ChangeUserPasswordDto,
  ) {
    await this.userService.setPassword(id, dto.password);
    return { message: 'Mot de passe modifié avec succès.' };
  }

  @Patch('two-factor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateAllTwoFactor(@Body() dto: UpdateTwoFactorDto) {
    await this.userService.setTwoFactorEnabledForAll(dto.enabled);
    return { enabled: dto.enabled };
  }

  @Patch(':id/two-factor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateUserTwoFactor(
    @Param('id') id: string,
    @Body() dto: UpdateTwoFactorDto,
  ) {
    await this.userService.setTwoFactorEnabled(id, dto.enabled);
    return { enabled: dto.enabled };
  }

  @Patch(':id/role')
  async updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.userService.updateRole(id, dto.role);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.userService.updateStatus(id, dto.is_active);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
  ) {
    await this.userService.delete(id);

    return {
      message: 'User deleted successfully',
    };
  }
}
