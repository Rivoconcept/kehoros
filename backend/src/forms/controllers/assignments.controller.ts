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

import { AssignmentService, AssignTemplateInput } from '../services/assignment.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('forms/assignments')
@UseGuards(JwtAuthGuard)
export class AssignmentsController {
  constructor(private readonly assignmentService: AssignmentService) {}

  // GET /forms/assignments : Retourne les assignations selon le rôle
  @Get()
  async findAllOrUserAssignments(@Request() req: any) {
    const userId = req.user.sub || req.user.id;
    const userRole = req.user.role;

    // Si c'est un simple utilisateur, on filtre directement ses assignations via findByUser
    if (userRole === 'user') {
      return this.assignmentService.findByUser(userId);
    }

    // Si admin ou manager, on retourne tout
    return this.assignmentService.findAll();
  }

  // GET /forms/assignments/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.assignmentService.findOne(id);
  }

  // POST /forms/assignments
  @Post()
  async assign(@Request() req: any, @Body() dto: Omit<AssignTemplateInput, 'assigned_by'>) {
    const assignedBy = req.user.sub || req.user.id;
    return this.assignmentService.assign({
      ...dto,
      assigned_by: assignedBy,
    });
  }

  // PATCH /forms/assignments/:id/status
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.assignmentService.updateStatus(id, status);
  }

  // PATCH /forms/assignments/:id/cancel
  @Patch(':id/cancel')
  async cancel(@Param('id') id: string) {
    return this.assignmentService.cancel(id);
  }
}