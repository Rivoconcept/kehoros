import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { Collaborators } from './entities/collaborators.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Computers } from '../inventory/computer/entities/computer.entity';
import { AssetStatus } from '../inventory/dto/createInventory.dto';

@Injectable()
export class CollaboratorService {
  constructor(
    @InjectRepository(Collaborators)
    private readonly collaboratorRepo: Repository<Collaborators>,
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
  ) {}

    async getCollab(): Promise<Collaborators[]> {
        return await this.collaboratorRepo.find();
    }


  async findAll(): Promise<Collaborators[]> {
    return await this.collaboratorRepo.find({ relations: ['computers'] });
  }

  async findByMatricule(matricule: string): Promise<Collaborators> {
    const collaborator = await this.collaboratorRepo.findOne({
      where: { matricule },
      relations: ['computers'],
    });
    if (!collaborator) {
      throw new NotFoundException(`Collaborator with matricule "${matricule}" not found`);
    }
    return collaborator;
  }

  async createOrUpdate(dto: CreateCollaboratorDto): Promise<Collaborators> {
    const normalizedDto = this.normalize(dto);
    let collaborator = await this.collaboratorRepo.findOneBy({ matricule: normalizedDto.matricule });
    if (collaborator) {
      this.collaboratorRepo.merge(collaborator, normalizedDto);
    } else {
      collaborator = this.collaboratorRepo.create(normalizedDto);
    }
    return await this.collaboratorRepo.save(collaborator);
  }

  async create(dto: CreateCollaboratorDto): Promise<Collaborators> {
    const normalizedDto = this.normalize(dto);
    const existing = await this.collaboratorRepo.findOne({
      where: [{ matricule: normalizedDto.matricule }, { email: normalizedDto.email }],
    });
    if (existing) {
      throw new ConflictException('A collaborator with this matricule or email already exists');
    }

    return this.collaboratorRepo.save(this.collaboratorRepo.create(normalizedDto));
  }

  async update(
    matricule: string,
    dto: Partial<Omit<CreateCollaboratorDto, 'matricule'>>,
  ): Promise<Collaborators> {
    const collaborator = await this.findByMatricule(matricule);
    const normalizedDto = this.normalize(dto);

    if (normalizedDto.email && normalizedDto.email !== collaborator.email) {
      const existing = await this.collaboratorRepo.findOneBy({ email: normalizedDto.email });
      if (existing) {
        throw new ConflictException('A collaborator with this email already exists');
      }
    }

    this.collaboratorRepo.merge(collaborator, normalizedDto);
    return this.collaboratorRepo.save(collaborator);
  }

  // 🚀 Méthode dédiée pour l'intégration automatique depuis les soumissions de formulaires dynamiques Kehoros
  async createOrUpdateFromForm(formData: Record<string, any>): Promise<Collaborators> {
    const matricule = formData.matricule;
    if (!matricule) {
      throw new Error('Matricule is required to register a collaborator from a form submission.');
    }

    let collaborator = await this.collaboratorRepo.findOneBy({ matricule });
    if (collaborator) {
      this.collaboratorRepo.merge(collaborator, formData);
    } else {
      collaborator = this.collaboratorRepo.create(formData);
    }
    return await this.collaboratorRepo.save(collaborator);
  }

  async bulkImport(dtos: CreateCollaboratorDto[]): Promise<{ imported: number }> {
    for (const dto of dtos) {
      await this.createOrUpdate(dto);
    }
    return { imported: dtos.length };
  }

  async remove(matricule: string): Promise<Collaborators> {
    return this.dataSource.transaction(async (manager) => {
      const collaborators = manager.getRepository(Collaborators);
      const collaborator = await collaborators.findOneBy({ matricule });
      if (!collaborator) {
        throw new NotFoundException(`Collaborator with matricule "${matricule}" not found`);
      }

      const users = manager.getRepository(User);
      const linkedUser = await users.findOne({
        where: { collaborator_id: collaborator.id },
      });
      const legacyUser = linkedUser
        ? null
        : await users
            .createQueryBuilder('user')
            .where('UPPER(TRIM(user.matricule)) = UPPER(:matricule)', {
              matricule: collaborator.matricule,
            })
            .andWhere('LOWER(TRIM(user.email)) = LOWER(:email)', {
              email: collaborator.email.trim(),
            })
            .getOne();
      const user = linkedUser ?? legacyUser;
      if (user) {
        await this.userService.deleteUserInTransaction(manager, user.id);
      }

      await manager.getRepository(Computers).update(
        { collaboratorId: collaborator.id },
        { collaboratorId: null, status: AssetStatus.IN_STOCK },
      );
      await collaborators.delete({ id: collaborator.id });
      return collaborator;
    });
  }

  private normalize<T extends Partial<CreateCollaboratorDto>>(dto: T): T {
    return {
      ...dto,
      ...(typeof dto.matricule === 'string' && { matricule: dto.matricule.trim() }),
      ...(typeof dto.email === 'string' && {
        email: dto.email.replace(/\u00a0/g, ' ').trim(),
      }),
      ...(typeof dto.delegatedMail === 'string' && {
        delegatedMail: dto.delegatedMail.replace(/\u00a0/g, ' ').trim() || null,
      }),
    };
  }
}