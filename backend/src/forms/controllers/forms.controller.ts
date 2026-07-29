import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { UserRole } from '../../user/user.entity';

import { FormsService } from '../services/forms.service';
import { CreateTemplateDto } from '../dto/create-template.dto';
import type { AssignTemplateInput } from '../services/assignment.service';
import type { StartResponseInput, SubmitResponseInput } from '../services/response.service';
import type { CreateQuestionInput, UpdateQuestionInput, CreateOptionInput } from '../services/question.service';

@Controller('forms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post('templates')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  createTemplate(@Body() dto: CreateTemplateDto) {
    return this.formsService.createTemplate(dto);
  }

  @Get('templates')
  findAllTemplates() {
    return this.formsService.findAllTemplates();
  }

  @Get('templates/:id')
  findTemplateById(@Param('id') id: string) {
    return this.formsService.findTemplateById(id);
  }

  @Patch('templates/:id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  updateTemplate(@Param('id') id: string, @Body() dto: CreateTemplateDto) {
    return this.formsService.updateTemplate(id, dto);
  }

  @Post('templates/:id/publish')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  publishTemplate(@Param('id') id: string) {
    return this.formsService.publishTemplate(id);
  }

  @Post('templates/:id/archive')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  archiveTemplate(@Param('id') id: string) {
    return this.formsService.archiveTemplate(id);
  }

  @Post('templates/:id/duplicate')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  duplicateTemplate(@Param('id') id: string, @Body() body?: { title?: string; category?: string }) {
    return this.formsService.duplicateTemplate(id, body);
  }

  @Delete('templates/:id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  removeTemplate(@Param('id') id: string) {
    return this.formsService.removeTemplate(id);
  }

  @Post('assignments')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  assignTemplate(@Body() dto: AssignTemplateInput) {
    return this.formsService.assignTemplate(dto);
  }

  @Get('assignments')
  findAssignments(@Query('userId') userId?: string, @Query('templateId') templateId?: string) {
    if (userId) {
      return this.formsService.findAssignmentsByUser(userId);
    }

    if (templateId) {
      return this.formsService.findAssignmentsByTemplate(templateId);
    }

    return this.formsService.findAssignments();
  }

  @Patch('assignments/:id/status')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  updateAssignmentStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.formsService.updateAssignmentStatus(id, body.status);
  }

  @Post('responses/start')
  startResponse(@Body() dto: StartResponseInput) {
    return this.formsService.startResponse(dto);
  }

  @Post('responses/draft')
  saveDraft(@Body() dto: SubmitResponseInput) {
    return this.formsService.saveDraft(dto);
  }

  @Post('responses/submit')
  @Roles(UserRole.USER, UserRole.MANAGER, UserRole.ADMIN)
  submitResponse(@Body() dto: SubmitResponseInput) {
    return this.formsService.submitResponse(dto);
  }

  @Get('responses/:assignmentId')
  findResponsesByAssignment(@Param('assignmentId') assignmentId: string) {
    return this.formsService.findResponsesByAssignment(assignmentId);
  }

  @Post('results/:responseId/evaluate')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  evaluateResponse(@Param('responseId') responseId: string, @Body() body?: { gradedBy?: string }) {
    return this.formsService.evaluateResponse(responseId, body?.gradedBy);
  }

  @Get('results/:responseId')
  findResultsByResponse(@Param('responseId') responseId: string) {
    return this.formsService.findResultsByResponse(responseId);
  }

  @Post('Questions')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  createQuestion(@Body() dto: CreateQuestionInput) {
    return this.formsService.createQuestion(dto);
  }

  @Get('templates/:templateId/Questions')
  findQuestionsByTemplate(@Param('templateId') templateId: string) {
    return this.formsService.findQuestionsByTemplate(templateId);
  }

  @Get('Questions/:id')
  findQuestionById(@Param('id') id: string) {
    return this.formsService.findQuestionById(id);
  }

  @Patch('Questions/:id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  updateQuestion(@Param('id') id: string, @Body() dto: UpdateQuestionInput) {
    return this.formsService.updateQuestion(id, dto);
  }

  @Delete('Questions/:id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  removeQuestion(@Param('id') id: string) {
    return this.formsService.removeQuestion(id);
  }

  @Post('options')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  createOption(@Body() dto: CreateOptionInput) {
    return this.formsService.createOption(dto);
  }

  @Patch('options/:id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  updateOption(@Param('id') id: string, @Body() dto: Partial<CreateOptionInput>) {
    return this.formsService.updateOption(id, dto);
  }

  @Delete('options/:id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  removeOption(@Param('id') id: string) {
    return this.formsService.removeOption(id);
  }
}
