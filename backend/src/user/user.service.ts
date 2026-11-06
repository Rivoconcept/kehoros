import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';

import { User, UserRole } from './entities/user.entity';
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
        two_factor_enabled: true,
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
    return this.userRepo
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', { email: email.trim() })
      .getOne();
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

  async updatePassword(id: string, password_hash: string): Promise<void> {
    await this.userRepo.update(id, { password_hash });
  }

  async setPassword(id: string, password: string): Promise<void> {
    await this.findOne(id);
    await this.updatePassword(id, await bcrypt.hash(password, 10));
  }

  async setTwoFactorEnabled(id: string, enabled: boolean): Promise<void> {
    await this.findOne(id);
    await this.userRepo.update(id, { two_factor_enabled: enabled });
  }

  async setTwoFactorEnabledForAll(enabled: boolean): Promise<void> {
    await this.userRepo
      .createQueryBuilder()
      .update(User)
      .set({ two_factor_enabled: enabled })
      .execute();
  }

  async generateRecoveryCode(id: string): Promise<string> {
    await this.findOne(id);
    const code = randomBytes(9).toString('hex');
    await this.updateRecoveryCodeHash(id, await bcrypt.hash(code, 10));
    return code;
  }

  async updateRecoveryCodeHash(id: string, recovery_code_hash: string): Promise<void> {
    await this.userRepo.update(id, { recovery_code_hash });
  }

  async consumeRecoveryCode(id: string, code: string): Promise<boolean> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.recovery_code_hash')
      .where('user.id = :id', { id })
      .getOne();
    const recoveryCodeHash = user?.recovery_code_hash;
    if (!recoveryCodeHash || !(await bcrypt.compare(code, recoveryCodeHash))) {
      return false;
    }

    const result = await this.userRepo
      .createQueryBuilder()
      .update(User)
      .set({ recovery_code_hash: null })
      .where('id = :id AND recovery_code_hash = :recoveryCodeHash', { id, recoveryCodeHash })
      .execute();
    return result.affected === 1;
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
