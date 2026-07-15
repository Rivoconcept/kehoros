import { Module } from '@nestjs/common';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Property])],  // enregistre l'entité
  controllers: [PropertyController],                // déclare les routes
  providers: [PropertyService],                     // déclare les services
  exports: [PropertyService],                       // rend le service disponible aux autres modules
})
export class PropertyModule {}