import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Department } from './entities/user-department.entity';
import { DepartmentController } from './user-department.controller';
import { DepartmentService } from './user-department.service';

@Module({
  imports: [TypeOrmModule.forFeature([Department])],
  controllers: [DepartmentController],
  providers: [DepartmentService],
  exports: [DepartmentService],
})
export class UserDepartmentModule {}
