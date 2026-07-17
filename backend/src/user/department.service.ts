import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Department } from './department.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,
  ) {}

  async findAll(): Promise<Department[]> {
    return this.departmentRepo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Department | null> {
    return this.departmentRepo.findOneBy({ id });
  }
}
