import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollaboratorService } from './collaborators.service';
import { CollaboratorController } from './collaborators.controller';
import { Collaborators } from './entities/collaborators.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Collaborators]), UserModule],
  providers: [CollaboratorService],
  controllers: [CollaboratorController],
  exports: [CollaboratorService],
})
export class CollaboratorsModule {}