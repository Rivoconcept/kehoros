import {
  Controller,
  Delete,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';

import { AssignmentService, AssignmentTargetType } from '../services/assignment.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';

export class AssignTemplateDto {
  template_id: string;
  deadline?: Date | string;
  status?: string;
  target_type?: AssignmentTargetType | 'ALL' | 'DEPARTMENT' | 'INDIVIDUAL' | 'USERS';
  user_id?: string;
  user_ids?: string[];
  registration_numbers?: string[];
  department_id?: string;
  department_ids?: string[];
}

@Controller('forms/assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssignmentsController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Get()
  async findAllOrUserAssignments(@Request() req: any) {
    const userId = req.user?.sub || req.user?.id;
    const userRole = req.user?.role;

    if (userRole === 'user') {
      return this.assignmentService.findByUser(userId);
    }

    return this.assignmentService.findAll();
  }

  @Get('eligible-users')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  async findEligibleUsers(@Query('templateId') templateId: string) {
    return this.assignmentService.findEligibleUsers(templateId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.assignmentService.findOne(id);
  }

  @Post()
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  async assign(@Request() req: any, @Body() dto: AssignTemplateDto) {
    const assignedBy = req.user?.sub || req.user?.id || req.user?.email;

    return this.assignmentService.assign({
      ...dto,
      assigned_by: assignedBy,
    });
  }

  @Post('access-settings')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  async updateAccessSettings(@Request() req: any, @Body() dto: any) {
    const currentUserId = req.user?.sub || req.user?.id || req.user?.email;

    return this.assignmentService.assign({
      template_id: dto.template_id,
      assigned_by: currentUserId,
      target_type: dto.target_type,
      department_ids: dto.department_ids || (dto.department_id ? [dto.department_id] : undefined),
      user_ids: dto.user_ids,
      registration_numbers: dto.registration_numbers,
    });
  }

  @Patch(':id/status')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.assignmentService.updateStatus(id, status);
  }

  @Delete('template/:templateId')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  async removeByTemplate(@Param('templateId') templateId: string) {
    const deleted = await this.assignmentService.removeByTemplate(templateId);
    return { deleted };
  }

  @Delete(':id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    await this.assignmentService.remove(id);
    return { message: 'Assignment deleted successfully' };
  }
}