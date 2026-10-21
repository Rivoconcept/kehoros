import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { ComputerModule } from './computer/computer.module';

@Module({
  providers: [InventoryService],
  controllers: [InventoryController],
  imports: [ComputerModule]
})
export class InventoryModule {}
