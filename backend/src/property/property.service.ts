import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './property.entity';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
  ) {}

  // Logique : récupérer toutes les propriétés
  findAll(): Promise<Property[]> {
    return this.propertyRepo.find();
  }

  // Logique : créer une propriété
  async create(data: Partial<Property>): Promise<Property> {
    const property = this.propertyRepo.create(data); // instancie l'objet
    return this.propertyRepo.save(property);          // sauvegarde en DB
  }

  // Logique : trouver par id, lever une erreur si pas trouvé
  async findOne(id: string): Promise<Property> {
    const property = await this.propertyRepo.findOne({ where: { id } });
    if (!property) throw new NotFoundException(`Property ${id} not found`);
    return property;
  }
}