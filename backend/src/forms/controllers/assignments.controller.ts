import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';

import { AssignmentService, AssignmentTargetType } from '../services/assignment.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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
@UseGuards(JwtAuthGuard)
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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.assignmentService.findOne(id);
  }

  @Post()
  async assign(@Request() req: any, @Body() dto: AssignTemplateDto) {
    const assignedBy = req.user?.sub || req.user?.id || req.user?.email;

    return this.assignmentService.assign({
      ...dto,
      assigned_by: assignedBy,
    });
  }

  @Post('access-settings')
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
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.assignmentService.updateStatus(id, status);
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string) {
    return this.assignmentService.cancel(id);
  }
}