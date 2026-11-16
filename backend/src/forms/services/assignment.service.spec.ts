import { DataSource } from 'typeorm';
import { FormAssignment } from '../entities/form-assignment.entity';
import { FormTemplate } from '../entities/form-template.entity';
import { AssignmentService, AssignmentTargetType } from './assignment.service';

describe('AssignmentService', () => {
  it('deletes every assignment for a template and detaches associated responses', async () => {
    const templateRepo = {
      findOne: jest.fn().mockResolvedValue({ id: 'template-1' }),
    };
    const assignmentRepo = {
      find: jest.fn().mockResolvedValue([{ id: 'assignment-1' }, { id: 'assignment-2' }]),
      delete: jest.fn().mockResolvedValue({ affected: 2 }),
    };
    const manager = {
      getRepository: jest.fn((entity: Function) =>
        entity === FormTemplate ? templateRepo : assignmentRepo,
      ),
      query: jest.fn(),
    };
    const dataSource = {
      transaction: jest.fn((callback: (manager: typeof manager) => unknown) =>
        callback(manager),
      ),
    };
    const service = new AssignmentService(
      {} as any,
      {} as any,
      {} as any,
      dataSource as unknown as DataSource,
    );

    await expect(service.removeByTemplate('template-1')).resolves.toBe(2);

    expect(manager.query).toHaveBeenCalledWith(
      'UPDATE "form_responses" SET "assignment_id" = NULL WHERE "assignment_id" = ANY($1::uuid[])',
      [['assignment-1', 'assignment-2']],
    );
    expect(assignmentRepo.delete).toHaveBeenCalledWith({
      template_id: 'template-1',
    });
  });

  it('deletes the assignment and detaches its responses transactionally', async () => {
    const assignmentRepo = {
      findOne: jest.fn().mockResolvedValue({ id: 'assignment-1' }),
      delete: jest.fn(),
    };
    const manager = {
      getRepository: jest.fn(() => assignmentRepo),
      query: jest.fn(),
    };
    const dataSource = {
      transaction: jest.fn((callback: (manager: typeof manager) => unknown) =>
        callback(manager),
      ),
    };
    const service = new AssignmentService(
      {} as any,
      {} as any,
      {} as any,
      dataSource as unknown as DataSource,
    );

    await service.remove('assignment-1');

    expect(manager.query).toHaveBeenCalledWith(
      'UPDATE "form_responses" SET "assignment_id" = NULL WHERE "assignment_id" = $1',
      ['assignment-1'],
    );
    expect(assignmentRepo.delete).toHaveBeenCalledWith('assignment-1');
  });

  it('does not remove responses when the assignment does not exist', async () => {
    const assignmentRepo = { findOne: jest.fn().mockResolvedValue(null) };
    const manager = {
      getRepository: jest.fn(() => assignmentRepo),
      query: jest.fn(),
    };
    const dataSource = {
      transaction: jest.fn((callback: (manager: typeof manager) => unknown) =>
        callback(manager),
      ),
    };
    const service = new AssignmentService(
      {} as any,
      {} as any,
      {} as any,
      dataSource as unknown as DataSource,
    );

    await expect(service.remove('missing-assignment')).rejects.toThrow(
      'Assignment with id missing-assignment not found',
    );
    expect(manager.query).not.toHaveBeenCalled();
  });

  it('resolves assignee by email or matricule, not a non-existent registration_number column', async () => {
    const assignmentRepo = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation((data) => data),
      save: jest.fn().mockImplementation(async (data) => ({ ...data, id: 'assignment-1' })),
    } as any;

    const templateRepo = {
      findOne: jest.fn().mockResolvedValue({ id: 'template-1' }),
    } as any;

    const userRepo = {
      findOne: jest
        .fn()
        .mockResolvedValueOnce({ id: 'assigner-1', email: 'rivo.k0949@keobiz.fr', matricule: 'K0949' })
        .mockResolvedValueOnce({ id: 'user-1', matricule: 'K0949' }),
    } as any;

    const service = new AssignmentService(
      assignmentRepo,
      templateRepo,
      userRepo,
      {} as DataSource,
    );

    await service.assign({
      template_id: 'template-1',
      assigned_by: 'K0949',
      target_type: AssignmentTargetType.INDIVIDUAL,
      user_id: 'user-1',
    });

    expect(userRepo.findOne).toHaveBeenNthCalledWith(1, {
      where: [
        { email: 'K0949' },
        { matricule: 'K0949' },
      ],
    });
  });
});
