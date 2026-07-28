import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FormAssignment } from '../entities/form-assignment.entity';
import { FormTemplate } from '../entities/form-template.entity';
import { User } from '../../user/user.entity';

export interface AssignTemplateInput {
  template_id: string;
  user_id: string;
  assigned_by: string;
  deadline?: Date | string;
  status?: string;
}

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(FormAssignment)
    private readonly assignmentRepo: Repository<FormAssignment>,
    @InjectRepository(FormTemplate)
    private readonly templateRepo: Repository<FormTemplate>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async assign(input: AssignTemplateInput): Promise<FormAssignment> {
    this.validateAssignInput(input);

    const template = await this.templateRepo.findOne({ where: { id: input.template_id } });
    if (!template) {
      throw new NotFoundException(`Template with id ${input.template_id} not found`);
    }

    const user = await this.userRepo.findOne({ where: { id: input.user_id } });
    if (!user) {
      throw new NotFoundException(`User with id ${input.user_id} not found`);
    }

    const existing = await this.assignmentRepo.findOne({
      where: {
        template_id: input.template_id,
        user_id: input.user_id,
      },
    });

    if (existing && existing.status !== 'cancelled') {
      throw new ConflictException('This template is already assigned to this user');
    }

    const assignment = this.assignmentRepo.create({
      template_id: input.template_id,
      user_id: input.user_id,
      assigned_by: input.assigned_by,
      deadline: this.normalizeDate(input.deadline) ?? undefined,
      status: input.status ?? 'pending',
    });

    return this.assignmentRepo.save(assignment);
  }

  async findAll(): Promise<FormAssignment[]> {
    return this.assignmentRepo.find({
      order: { assigned_at: 'DESC' },
      relations: {
        template: true,
      },
    });
  }

  async findByUser(userId: string): Promise<FormAssignment[]> {
    return this.assignmentRepo.find({
      where: { user_id: userId },
      order: { assigned_at: 'DESC' },
      relations: {
        template: true,
      },
    });
  }

  async findByTemplate(templateId: string): Promise<FormAssignment[]> {
    return this.assignmentRepo.find({
      where: { template_id: templateId },
      order: { assigned_at: 'DESC' },
      relations: {
        template: true,
      },
    });
  }

  async findOne(id: string): Promise<FormAssignment> {
    const assignment = await this.assignmentRepo.findOne({
      where: { id },
      relations: {
        template: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with id ${id} not found`);
    }

    return assignment;
  }

  async updateStatus(id: string, status: string): Promise<FormAssignment> {
    const assignment = await this.findOne(id);

    const allowedStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      throw new BadRequestException('Invalid assignment status');
    }

    await this.assignmentRepo.update(id, {
      status,
      completed_at: status === 'completed' ? new Date() : undefined,
    });

    return this.findOne(id);
  }

  async renew(id: string, deadline?: Date | string): Promise<FormAssignment> {
    const assignment = await this.findOne(id);

    if (assignment.status === 'completed') {
      throw new ConflictException('Cannot renew a completed assignment');
    }

    await this.assignmentRepo.update(id, {
      deadline: this.normalizeDate(deadline) ?? undefined,
      status: 'pending',
    });

    return this.findOne(id);
  }

  async cancel(id: string): Promise<FormAssignment> {
    const assignment = await this.findOne(id);

    if (assignment.status === 'cancelled') {
      return assignment;
    }

    await this.assignmentRepo.update(id, {
      status: 'cancelled',
      completed_at: undefined,
    });

    return this.findOne(id);
  }

  private validateAssignInput(input: AssignTemplateInput): void {
    if (!input.template_id?.trim()) {
      throw new BadRequestException('template_id is required');
    }

    if (!input.user_id?.trim()) {
      throw new BadRequestException('user_id is required');
    }

    if (!input.assigned_by?.trim()) {
      throw new BadRequestException('assigned_by is required');
    }
  }

  private normalizeDate(value?: Date | string): Date | null | undefined {
    if (!value) {
      return undefined;
    }

    if (value instanceof Date) {
      return value;
    }

    return new Date(value);
  }
}
