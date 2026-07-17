import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { Department } from './department.entity';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Department,
    ]),
  ],
  controllers: [
    UserController,
    DepartmentController,
  ],
  providers: [
    UserService,
    DepartmentService,
  ],
  exports: [
    UserService,
    DepartmentService,
  ],
})
export class UserModule {}
