import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';

import { FormAssignment } from '../entities/form-assignment.entity';
import { FormTemplate } from '../entities/form-template.entity';
import { User } from '../../user/entities/user.entity';

export enum AssignmentTargetType {
  ALL = 'ALL',
  DEPARTMENT = 'DEPARTMENT',
  INDIVIDUAL = 'INDIVIDUAL',
  USERS = 'USERS',
}

export interface AssignTemplateInput {
  template_id: string;
  assigned_by: string;
  deadline?: Date | string;
  status?: string;

  target_type?: AssignmentTargetType | 'ALL' | 'DEPARTMENT' | 'INDIVIDUAL' | 'USERS';

  user_id?: string;
  user_ids?: string[];
  registration_numbers?: string[];

  department_id?: string;
  department_ids?: string[];
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
    private readonly dataSource: DataSource,
  ) {}

  async assign(input: AssignTemplateInput): Promise<FormAssignment[]> {
    this.validateAssignInput(input);

    const template = await this.templateRepo.findOne({ where: { id: input.template_id } });
    if (!template) {
      throw new NotFoundException(`Template with id ${input.template_id} not found`);
    }

    // --- Résolution de l'UUID pour assigned_by ---
    let assignerUuid: string | undefined = undefined;

    if (input.assigned_by) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        input.assigned_by,
      );

      if (isUuid) {
        assignerUuid = input.assigned_by;
      } else {
        // Recherche par email ou matricule (ex. K0949)
        const assigner = await this.userRepo.findOne({
          where: [
            { email: input.assigned_by },
            { matricule: input.assigned_by },
          ],
        });

        if (assigner) {
          assignerUuid = assigner.id;
        }
      }
    }

    const targetUsers = await this.resolveTargetUsers(input);

    if (targetUsers.length === 0) {
      throw new BadRequestException('No eligible users found for this assignment request');
    }

    const createdAssignments: FormAssignment[] = [];

    for (const user of targetUsers) {
      const existing = await this.assignmentRepo.findOne({
        where: {
          template_id: input.template_id,
          user_id: user.id,
        },
      });

      if (existing && existing.status !== 'cancelled') {
        const isSingleUser =
          (input.target_type === AssignmentTargetType.INDIVIDUAL ||
            input.target_type === AssignmentTargetType.USERS) &&
          targetUsers.length === 1;

        if (isSingleUser) {
          throw new ConflictException('This template is already assigned to this user');
        }
        continue;
      }

      const assignmentData: Partial<FormAssignment> = {
        template_id: input.template_id,
        user_id: user.id,
        status: input.status ?? 'pending',
      };

      if (assignerUuid) {
        assignmentData.assigned_by = assignerUuid;
      }

      if (input.deadline) {
        assignmentData.deadline = this.normalizeDate(input.deadline) ?? undefined;
      }

      const assignment = this.assignmentRepo.create(assignmentData);
      const saved = await this.assignmentRepo.save(assignment);
      createdAssignments.push(saved);
    }

    return createdAssignments;
  }

  async findAll(): Promise<FormAssignment[]> {
    return this.assignmentRepo.find({
      order: { assigned_at: 'DESC' },
      relations: {
        template: true,
        user: true,
        assigner: true,
      },
    });
  }

  async findByUser(userId: string): Promise<FormAssignment[]> {
    return this.assignmentRepo.find({
      where: { user_id: userId },
      order: { assigned_at: 'DESC' },
      relations: {
        template: true,
        user: true,
      },
    });
  }

  async findByTemplate(templateId: string): Promise<FormAssignment[]> {
    return this.assignmentRepo.find({
      where: { template_id: templateId },
      order: { assigned_at: 'DESC' },
      relations: {
        template: true,
        user: true,
      },
    });
  }

  async findOne(id: string): Promise<FormAssignment> {
    const assignment = await this.assignmentRepo.findOne({
      where: { id },
      relations: {
        template: true,
        user: true,
        assigner: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with id ${id} not found`);
    }

    return assignment;
  }

  async updateStatus(id: string, status: string): Promise<FormAssignment> {
    await this.findOne(id);

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

  async remove(id: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const assignmentRepo = manager.getRepository(FormAssignment);
      const assignment = await assignmentRepo.findOne({ where: { id } });
      if (!assignment) {
        throw new NotFoundException(`Assignment with id ${id} not found`);
      }

      await manager.query(
        'UPDATE "form_responses" SET "assignment_id" = NULL WHERE "assignment_id" = $1',
        [id],
      );
      await assignmentRepo.delete(id);
    });
  }

  async removeByTemplate(templateId: string): Promise<number> {
    return this.dataSource.transaction(async (manager) => {
      const template = await manager
        .getRepository(FormTemplate)
        .findOne({ where: { id: templateId } });
      if (!template) {
        throw new NotFoundException(`Template with id ${templateId} not found`);
      }

      const assignmentRepo = manager.getRepository(FormAssignment);
      const assignments = await assignmentRepo.find({
        where: { template_id: templateId },
        select: { id: true },
      });
      const assignmentIds = assignments.map(({ id }) => id);
      if (!assignmentIds.length) return 0;

      await manager.query(
        'UPDATE "form_responses" SET "assignment_id" = NULL WHERE "assignment_id" = ANY($1::uuid[])',
        [assignmentIds],
      );
      const result = await assignmentRepo.delete({ template_id: templateId });
      return result.affected ?? assignmentIds.length;
    });
  }

  async findEligibleUsers(templateId: string): Promise<Partial<User>[]> {
    const template = await this.templateRepo.findOne({
      where: { id: templateId },
    });
    if (!template) {
      throw new NotFoundException(`Template with id ${templateId} not found`);
    }

    const existing = await this.assignmentRepo.find({
      where: { template_id: templateId },
      select: { user_id: true },
    });
    const assignedUserIds = new Set(
      existing.map(({ user_id }) => user_id).filter((id): id is string => Boolean(id)),
    );
    const users = await this.userRepo.find({
      select: {
        id: true,
        matricule: true,
        first_name: true,
        last_name: true,
        email: true,
        is_active: true,
      },
      order: { last_name: 'ASC', first_name: 'ASC' },
    });

    return users.filter((user) => user.is_active && !assignedUserIds.has(user.id));
  }

  private async resolveTargetUsers(input: AssignTemplateInput): Promise<User[]> {
    const targetType = input.target_type ?? AssignmentTargetType.INDIVIDUAL;

    switch (targetType) {
      case AssignmentTargetType.ALL:
        return this.userRepo.find();

      case AssignmentTargetType.DEPARTMENT: {
        const deptIds = (input.department_ids || (input.department_id ? [input.department_id] : []))
          .filter((id) => Boolean(id && String(id).trim()));

        if (deptIds.length === 0) {
          throw new BadRequestException('department_ids or department_id is required for DEPARTMENT assignment');
        }

        return this.userRepo.find({
          where: {
            department_id: In(deptIds),
          } as any,
        });
      }

      case AssignmentTargetType.USERS:
      case AssignmentTargetType.INDIVIDUAL: {
        const validUserIds = (input.user_ids || []).filter((id) => Boolean(id && String(id).trim()));
        if (validUserIds.length > 0) {
          return this.userRepo.find({
            where: { id: In(validUserIds) },
          });
        }

        if (input.user_id && String(input.user_id).trim()) {
          const user = await this.userRepo.findOne({ where: { id: String(input.user_id).trim() } });
          if (!user) {
            throw new NotFoundException(`User with id ${input.user_id} not found`);
          }
          return [user];
        }

        const cleanMatricules = (input.registration_numbers || [])
          .map((m) => String(m).trim())
          .filter(Boolean);

        if (cleanMatricules.length > 0) {
          return this.userRepo.find({
            where: {
              matricule: In(cleanMatricules),
            } as any,
          });
        }

        throw new BadRequestException(
          'Either user_id, user_ids, or registration_numbers must be provided for INDIVIDUAL/USERS assignment',
        );
      }

      default:
        throw new BadRequestException(`Unsupported target_type: ${targetType}`);
    }
  }

  private validateAssignInput(input: AssignTemplateInput): void {
    if (!input.template_id?.trim()) {
      throw new BadRequestException('template_id is required');
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