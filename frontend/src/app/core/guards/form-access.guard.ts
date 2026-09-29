import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormTemplate } from '../entities/form-template.entity';

@Injectable()
export class FormAccessGuard implements CanActivate {
  constructor(
    @InjectRepository(FormTemplate)
    private readonly templateRepo: Repository<FormTemplate>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Set by AuthGuard
    const templateId = request.params.templateId || request.body.template_id;

    if (!templateId) {
      return true;
    }

    const template = await this.templateRepo.findOne({ where: { id: templateId } });

    if (!template) {
      throw new NotFoundException('Form template not found.');
    }

    // 1. ALL -> Everyone can access
    if (!template.target_type || template.target_type === 'ALL') {
      return true;
    }

    // 2. DEPARTMENT -> Check user's department
    if (template.target_type === 'DEPARTMENT') {
      const allowedDepts = template.allowed_departments || [];
      if (!allowedDepts.includes(user.department_id)) {
        throw new ForbiddenException('You do not have permission to access this form.');
      }
      return true;
    }

    // 3. INDIVIDUAL -> Check user's registration number (Matricule)
    if (template.target_type === 'INDIVIDUAL') {
      const allowedNumbers = template.allowed_registration_numbers || [];
      if (!allowedNumbers.includes(user.registration_number)) {
        throw new ForbiddenException('You do not have permission to access this form.');
      }
      return true;
    }

    return true;
  }
}