import { Controller, Get } from '@nestjs/common';

import { DepartmentService } from './user-department.service';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  async getDepartments() {
    return this.departmentService.findAll();
  }
}
