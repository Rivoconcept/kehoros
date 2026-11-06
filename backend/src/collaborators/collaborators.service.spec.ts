import { ConflictException } from '@nestjs/common';
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

    return {
      collaboratorRepo,
      service: new CollaboratorService(collaboratorRepo as any),
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
});
