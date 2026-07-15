import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormTemplate } from './entities/form-template.entity';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(FormTemplate)
    private readonly formRepo: Repository<FormTemplate>,
  ) {}

  // Logique : récupérer toutes les propriétés
  findAll(): Promise<FormTemplate[]> {
    return this.formRepo.find();
  }


  // Logique : trouver par id, lever une erreur si pas trouvé
  findOne(id: string): Promise<FormTemplate | null> {
    return this.formRepo.findOne({ 
      where: { id }, 
      relations: { 
        questions: { 
          options: true 
        } 
      } 
    });
  }

  // Logique : créer une propriété
  create(data: Partial<FormTemplate>): Promise<FormTemplate> {
    const form = this.formRepo.create(data);
    return this.formRepo.save(form);
  }
}