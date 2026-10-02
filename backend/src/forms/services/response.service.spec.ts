import { NotFoundException } from '@nestjs/common';
import { ResponseService } from './response.service';

describe('ResponseService', () => {
  it('saves a direct template response with its answers and authenticated user', async () => {
    const responseRepo = {
      create: jest.fn((data) => data),
      save: jest.fn(async (data) => ({ ...data, id: 'response-1' })),
    } as any;
    const templateRepo = {
      findOne: jest.fn().mockResolvedValue({ id: 'template-1' }),
    } as any;
    const assignmentRepo = {
      findOne: jest.fn().mockResolvedValue({
        id: 'assignment-1',
        template_id: 'template-1',
        user_id: 'user-1',
      }),
      update: jest.fn(),
    } as any;
    const service = new ResponseService(
      responseRepo,
      templateRepo,
      {} as any,
      assignmentRepo,
      {} as any,
    );
    const answers = { 'question-1': 'My answer' };

    const result = await service.submit({
      template_id: 'template-1',
      assignment_id: 'assignment-1',
      user_id: 'user-1',
      answers,
    });

    expect(result).toMatchObject({
      id: 'response-1',
      template_id: 'template-1',
      assignment_id: 'assignment-1',
      user_id: 'user-1',
      answers,
      status: 'SUBMITTED',
    });
    expect(result.submitted_at).toBeInstanceOf(Date);
    expect(assignmentRepo.update).toHaveBeenCalledWith(
      'assignment-1',
      expect.objectContaining({ status: 'completed' }),
    );
  });

  it('returns not found when the submitted template does not exist', async () => {
    const responseRepo = {
      create: jest.fn(),
      save: jest.fn(),
    } as any;
    const templateRepo = {
      findOne: jest.fn().mockResolvedValue(null),
    } as any;
    const service = new ResponseService(
      responseRepo,
      templateRepo,
      {} as any,
      {} as any,
      {} as any,
    );

    await expect(
      service.submit({
        template_id: 'missing-template',
        answers: {},
      }),
    ).rejects.toThrow(NotFoundException);
    expect(responseRepo.save).not.toHaveBeenCalled();
  });

  it('finds an earlier direct submission and returns its JSON answers for the assignment', async () => {
    const submittedAt = new Date('2026-10-02T08:00:00Z');
    const assignmentRepo = {
      findOne: jest.fn().mockResolvedValue({
        id: 'assignment-1',
        template_id: 'template-1',
        user_id: 'user-1',
        status: 'pending',
        template: { title: 'Safety form', category: 'Safety' },
        user: { first_name: 'Ari', last_name: 'User', email: 'ari@example.test' },
      }),
      update: jest.fn(),
    } as any;
    const responseRepo = {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue({
        id: 'response-1',
        template_id: 'template-1',
        assignment_id: null,
        user_id: 'user-1',
        submitted_at: submittedAt,
        duration_seconds: 120,
        answers: { 'question-1': 'Done' },
      }),
      update: jest.fn(),
    } as any;
    const answerRepo = { find: jest.fn().mockResolvedValue([]) } as any;
    const questionRepo = {
      find: jest.fn().mockResolvedValue([
        { id: 'question-1', title: 'Completed?', type: 'TEXT' },
      ]),
    } as any;
    const service = new ResponseService(
      responseRepo,
      {} as any,
      answerRepo,
      assignmentRepo,
      questionRepo,
    );

    const result = await service.getAssignmentResult('assignment-1');

    expect(result.status).toBe('completed');
    expect(result.questions).toEqual([
      {
        id: 'question-1',
        label: 'Completed?',
        type: 'TEXT',
        userAnswer: 'Done',
      },
    ]);
    expect(responseRepo.update).toHaveBeenCalledWith('response-1', {
      assignment_id: 'assignment-1',
    });
    expect(assignmentRepo.update).toHaveBeenCalledWith('assignment-1', {
      status: 'completed',
      completed_at: submittedAt,
    });
  });

});