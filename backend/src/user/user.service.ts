import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User, UserRole } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Liste tous les utilisateurs
   */
  async getUsers(): Promise<User[]> {
    return this.userRepo.find({
      relations: {
        department: true,
        manager: true,
      },
      order: {
        last_name: 'ASC',
        first_name: 'ASC',
      },
      select: {
        id: true,
        matricule: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        manager_id: true,
        department_id: true,
        role: true,
        is_active: true,
        created_at: true,
      },
    });
  }

  async getManagers(): Promise<User[]> {
    return this.userRepo.find({
      where: { role: UserRole.MANAGER },
      order: {
        last_name: 'ASC',
        first_name: 'ASC',
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
      },
    });
  }

  /**
   * Recherche par ID
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  /**
   * Recherche par email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { email },
    });
  }

  /**
   * Création d'un utilisateur
   */
  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  /**
   * Modification complète des informations utilisateur
   */
  async updateUser(
    id: string,
    dto: UpdateUserDto,
  ): Promise<User> {

    await this.userRepo.update(id, dto);

    return this.findOne(id);
  }

  /**
   * Modification du rôle
   */
  async updateRole(
    id: string,
    role: UserRole,
  ): Promise<User> {

    await this.userRepo.update(id, {
      role,
    });

    return this.findOne(id);
  }

  /**
   * Activation / Désactivation
   */
  async updateStatus(
    id: string,
    is_active: boolean,
  ): Promise<User> {

    await this.userRepo.update(id, {
      is_active,
    });

    return this.findOne(id);
  }

  /**
   * Suppression
   */
  async delete(id: string): Promise<void> {

    const user = await this.findOne(id);

    await this.userRepo.remove(user);
  }
}

