import { ConflictException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Collaborators } from './entities/collaborators.entity';
import { Computers } from '../inventory/computer/entities/computer.entity';
import { User } from '../user/entities/user.entity';
import { AssetStatus } from '../inventory/dto/createInventory.dto';
import { CollaboratorService } from './collaborators.service';

describe('CollaboratorService', () => {
  const createService = (repoOverrides: Record<string, jest.Mock> = {}) => {
    const collaboratorRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn((data) => data),
      merge: jest.fn((entity, data) => Object.assign(entity, data)),
      save: jest.fn(async (entity) => entity),
      remove: jest.fn(),
      ...repoOverrides,
    };

    const dataSource = {};
    const userService = { deleteUserInTransaction: jest.fn() };

    return {
      collaboratorRepo,
      service: new CollaboratorService(
        collaboratorRepo as any,
        dataSource as DataSource,
        userService as any,
      ),
    };
  };

  it('creates a collaborator and normalizes Excel whitespace in email fields', async () => {
    const { collaboratorRepo, service } = createService();
    collaboratorRepo.findOne.mockResolvedValue(null);

    const result = await service.create({
      matricule: ' K1729 ',
      nom: 'ANDRIANANAHARISON',
      prenoms: 'Heriniaina Ismaël',
      email: 'herinirina.k1729@keobiz.fr\u00a0',
      delegatedMail: ' alain.k0005@keobiz.fr ',
      noticed: '',
    });

    expect(collaboratorRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        matricule: 'K1729',
        email: 'herinirina.k1729@keobiz.fr',
        delegatedMail: 'alain.k0005@keobiz.fr',
        noticed: '',
      }),
    );
    expect(result.noticed).toBe('');
  });

  it('rejects creation when the matricule or email is already in use', async () => {
    const { collaboratorRepo, service } = createService();
    collaboratorRepo.findOne.mockResolvedValue({ matricule: 'K1729' });

    await expect(
      service.create({
        matricule: 'K1729',
        nom: 'Test',
        email: 'test@example.test',
      }),
    ).rejects.toThrow(ConflictException);
    expect(collaboratorRepo.save).not.toHaveBeenCalled();
  });

  it('updates only fields provided in the patch', async () => {
    const existing = {
      matricule: 'K1729',
      email: 'old@example.test',
      fonction: 'OPERATEUR ONLINE',
    };
    const { collaboratorRepo, service } = createService({
      findOne: jest.fn().mockResolvedValue(existing),
      findOneBy: jest.fn().mockResolvedValue(null),
    });

    const result = await service.update('K1729', { fonction: 'TEST' });

    expect(result).toMatchObject({
      matricule: 'K1729',
      email: 'old@example.test',
      fonction: 'TEST',
    });
  });

  it('deletes the linked user and returns the collaborator computer to stock', async () => {
    const collaborator = {
      id: 'collaborator-id',
      matricule: 'K1729',
      email: 'person@example.test',
    };
    const collaboratorRepo = {
      findOneBy: jest.fn().mockResolvedValue(collaborator),
      delete: jest.fn(),
    };
    const userRepo = {
      findOne: jest.fn().mockResolvedValue({
        id: 'user-id',
        collaborator_id: collaborator.id,
      }),
    };
    const computerRepo = { update: jest.fn() };
    const manager = {
      getRepository: jest.fn((entity: Function) => {
        if (entity === Collaborators) return collaboratorRepo;
        if (entity === User) return userRepo;
        return computerRepo;
      }),
    };
    const dataSource = {
      transaction: jest.fn((callback: (manager: typeof manager) => unknown) =>
        callback(manager),
      ),
    };
    const userService = { deleteUserInTransaction: jest.fn() };
    const service = new CollaboratorService(
      {} as any,
      dataSource as unknown as DataSource,
      userService as any,
    );

    await service.remove(collaborator.matricule);

    expect(userService.deleteUserInTransaction).toHaveBeenCalledWith(
      manager,
      'user-id',
    );
    expect(computerRepo.update).toHaveBeenCalledWith(
      { collaboratorId: collaborator.id },
      { collaboratorId: null, status: AssetStatus.IN_STOCK },
    );
    expect(collaboratorRepo.delete).toHaveBeenCalledWith({
      id: collaborator.id,
    });
  });
});
