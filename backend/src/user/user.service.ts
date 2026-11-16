import {
  ConflictException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, FindOptionsWhere, In, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';

import { User, UserRole } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { FormAnswer } from '../forms/entities/form-answer.entity';
import { FormAssignment } from '../forms/entities/form-assignment.entity';
import { FormResponse } from '../forms/entities/form-response.entity';
import { FormResult } from '../forms/entities/form-result.entity';
import { FormSession } from '../forms/entities/form-session.entity';
import { AssetStatus } from '../inventory/dto/createInventory.dto';
import { Computers } from '../inventory/computer/entities/computer.entity';
import { Collaborators } from '../collaborators/entities/collaborators.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
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

  async registerFromCollaborator(data: {
    email: string;
    matricule: string;
    password_hash: string;
    phone?: string;
  }): Promise<User> {
    const email = data.email.trim().toLowerCase();
    const matricule = data.matricule.trim();

    return this.dataSource.transaction(async (manager) => {
      const collaborator = await manager
        .getRepository(Collaborators)
        .createQueryBuilder('collaborator')
        .where('LOWER(TRIM(collaborator.email)) = :email', { email })
        .andWhere('UPPER(TRIM(collaborator.matricule)) = UPPER(:matricule)', {
          matricule,
        })
        .getOne();

      if (!collaborator) {
        throw new ForbiddenException(
          'Seuls les collaborateurs enregistrés peuvent créer un compte.',
        );
      }

      const users = manager.getRepository(User);
      const existing = await users
        .createQueryBuilder('user')
        .where('LOWER(user.email) = :email', { email })
        .getOne();
      if (existing) {
        throw new ConflictException('Un compte existe déjà pour cet e-mail.');
      }

      const linkedUser = await users.findOne({
        where: { collaborator_id: collaborator.id },
      });
      if (linkedUser) {
        throw new ConflictException('Ce collaborateur possède déjà un compte.');
      }

      const user = users.create({
        collaborator_id: collaborator.id,
        matricule: collaborator.matricule,
        email: collaborator.email.trim().toLowerCase(),
        first_name: collaborator.prenoms?.trim() || collaborator.nom.trim(),
        last_name: collaborator.nom.trim(),
        password_hash: data.password_hash,
        phone: data.phone,
      });
      return users.save(user);
    });
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
    await this.dataSource.transaction(async (manager) => {
      await this.deleteUserInTransaction(manager, id);
    });
  }

  async deleteUserInTransaction(manager: EntityManager, id: string): Promise<void> {
    const users = manager.getRepository(User);
    const user = await users.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);

      const assignments = manager.getRepository(FormAssignment);
      const assignedToUser = await assignments.find({
        where: { user_id: id },
        select: { id: true },
      });
      const assignmentIds = assignedToUser.map(({ id: assignmentId }) => assignmentId);

      const responses = manager.getRepository(FormResponse);
      const responseConditions: FindOptionsWhere<FormResponse>[] = [
        { user_id: id },
      ];
      if (assignmentIds.length) {
        responseConditions.push({ assignment_id: In(assignmentIds) });
      }
      const userResponses = await responses.find({
        where: responseConditions,
        select: { id: true },
      });
      const responseIds = userResponses.map(({ id: responseId }) => responseId);

      const sessions = manager.getRepository(FormSession);
      const userSessions = await sessions.find({
        where: { user_id: id },
        select: { id: true },
      });
      const sessionIds = userSessions.map(({ id: sessionId }) => sessionId);

      const answers = manager.getRepository(FormAnswer);
      const answerConditions: FindOptionsWhere<FormAnswer>[] = [];
      if (sessionIds.length) {
        answerConditions.push({ session_id: In(sessionIds) });
      }
      if (responseIds.length) {
        answerConditions.push({ response_id: In(responseIds) });
      }
      if (answerConditions.length) {
        await answers.delete(answerConditions);
      }

      if (responseIds.length) {
        await manager.getRepository(FormResult).delete({
          response_id: In(responseIds),
        });
        await responses.delete({ id: In(responseIds) });
      }
      if (sessionIds.length) {
        await sessions.delete({ id: In(sessionIds) });
      }

      await assignments.update({ assigned_by: id }, { assigned_by: null });
      await assignments.delete({ user_id: id });
      await users.update({ manager_id: id }, { manager_id: null });
      await manager.query(
        'UPDATE "departments" SET "manager_id" = NULL WHERE "manager_id" = $1',
        [id],
      );
      await manager.query(
        'UPDATE "form_templates" SET "created_by" = NULL WHERE "created_by" = $1',
        [id],
      );
      await manager.query(
        'UPDATE "form_results" SET "graded_by" = NULL WHERE "graded_by" = $1',
        [id],
      );

      const collaboratorRepo = manager.getRepository(Collaborators);
      let collaborator = user.collaborator_id
        ? await collaboratorRepo.findOneBy({ id: user.collaborator_id })
        : null;
      if (!collaborator && user.matricule) {
        collaborator = await collaboratorRepo.findOneBy({ matricule: user.matricule });
      }
      if (!collaborator) collaborator = await collaboratorRepo.findOneBy({ email: user.email });
      if (collaborator) {
        await manager.getRepository(Computers).update(
          { collaboratorId: collaborator.id },
          { collaboratorId: null, status: AssetStatus.IN_STOCK },
        );
      }
      await users.delete(id);
      await users.delete(id);
  }
}
