import { AssignmentService, AssignmentTargetType } from './assignment.service';

describe('AssignmentService', () => {
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

    const service = new AssignmentService(assignmentRepo, templateRepo, userRepo);

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
