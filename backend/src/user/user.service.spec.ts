import { DataSource, Repository } from 'typeorm';
import { Collaborators } from '../collaborators/entities/collaborators.entity';
import { FormAnswer } from '../forms/entities/form-answer.entity';
import { FormAssignment } from '../forms/entities/form-assignment.entity';
import { FormResponse } from '../forms/entities/form-response.entity';
import { FormResult } from '../forms/entities/form-result.entity';
import { FormSession } from '../forms/entities/form-session.entity';
import { AssetStatus } from '../inventory/dto/createInventory.dto';
import { Computers } from '../inventory/computer/entities/computer.entity';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  const user = {
    id: 'user-id',
    email: 'person@example.com',
    matricule: 'K0001',
  } as User;
  const repos = new Map<Function, Record<string, jest.Mock>>();
  const userRepo = {};
  const users = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    createQueryBuilder: jest.fn(),
    create: jest.fn((data) => data),
    save: jest.fn(async (entity) => entity),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const assignments = {
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const responses = { find: jest.fn(), delete: jest.fn() };
  const sessions = { find: jest.fn(), delete: jest.fn() };
  const answers = { delete: jest.fn() };
  const results = { delete: jest.fn() };
  const collaborators = {
    findOneBy: jest.fn(),
    createQueryBuilder: jest.fn(),
  };
  const computers = { update: jest.fn() };
  const manager = {
    getRepository: jest.fn((entity: Function) => repos.get(entity)),
    query: jest.fn(),
  };
  const dataSource = {
    transaction: jest.fn((callback: (transactionManager: typeof manager) => unknown) =>
      callback(manager),
    ),
  };

  let service: UserService;

  beforeEach(() => {
    jest.clearAllMocks();
    repos.clear();
    repos.set(User, users);
    repos.set(FormAssignment, assignments);
    repos.set(FormResponse, responses);
    repos.set(FormSession, sessions);
    repos.set(FormAnswer, answers);
    repos.set(FormResult, results);
    repos.set(Collaborators, collaborators);
    repos.set(Computers, computers);

    users.findOne.mockResolvedValue(user);
    users.findOneBy.mockResolvedValue(null);
    users.createQueryBuilder.mockReturnValue({
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(null),
    });
    assignments.find.mockResolvedValue([{ id: 'assignment-id' }]);
    responses.find.mockResolvedValue([{ id: 'response-id' }]);
    sessions.find.mockResolvedValue([{ id: 'session-id' }]);
    collaborators.findOneBy.mockResolvedValue({ id: 'collaborator-id' });
    collaborators.createQueryBuilder.mockReturnValue({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue({
        id: 'collaborator-id',
        matricule: 'K0001',
        email: 'person@example.com',
        prenoms: 'Test',
        nom: 'Person',
      }),
    });

    service = new UserService(
      userRepo as Repository<User>,
      dataSource as unknown as DataSource,
    );
  });

  it('creates an account only from a matching collaborator record', async () => {
    users.findOne.mockResolvedValue(null);

    await service.registerFromCollaborator({
      email: ' PERSON@example.com ',
      matricule: ' K0001 ',
      password_hash: 'hashed-password',
    });

    expect(collaborators.createQueryBuilder).toHaveBeenCalledWith('collaborator');
    expect(users.save).toHaveBeenCalledWith(
      expect.objectContaining({
        collaborator_id: 'collaborator-id',
        matricule: 'K0001',
        email: 'person@example.com',
        first_name: 'Test',
        last_name: 'Person',
        password_hash: 'hashed-password',
      }),
    );
  });

  it('rejects account creation when the collaborator is not found', async () => {
    collaborators.createQueryBuilder.mockReturnValue({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(null),
    });

    await expect(
      service.registerFromCollaborator({
        email: 'person@example.com',
        matricule: 'K0001',
        password_hash: 'hashed-password',
      }),
    ).rejects.toThrow('Seuls les collaborateurs enregistrés peuvent créer un compte.');

    expect(users.save).not.toHaveBeenCalled();
  });

  it('removes user form data and returns their computer to stock transactionally', async () => {
    await service.delete(user.id);

    expect(dataSource.transaction).toHaveBeenCalledTimes(1);
    expect(answers.delete).toHaveBeenCalled();
    expect(results.delete).toHaveBeenCalled();
    expect(responses.delete).toHaveBeenCalled();
    expect(sessions.delete).toHaveBeenCalled();
    expect(assignments.delete).toHaveBeenCalledWith({ user_id: user.id });
    expect(computers.update).toHaveBeenCalledWith(
      { collaboratorId: 'collaborator-id' },
      { collaboratorId: null, status: AssetStatus.IN_STOCK },
    );
    expect(users.delete).toHaveBeenCalledWith(user.id);
  });

  it('does not delete an unknown user', async () => {
    users.findOne.mockResolvedValue(null);

    await expect(service.delete(user.id)).rejects.toThrow('User user-id not found');

    expect(assignments.delete).not.toHaveBeenCalled();
    expect(users.delete).not.toHaveBeenCalled();
  });
});
