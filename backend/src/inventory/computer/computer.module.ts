import { Module } from '@nestjs/common';
import { ComputerService } from './computer.service';
import { ComputerController } from './computer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Computers } from './entities/computer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Computers])],
  providers: [ComputerService],
  controllers: [ComputerController]
})
export class ComputerModule {}
