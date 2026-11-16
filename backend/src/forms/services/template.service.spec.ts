import { DataSource, Repository } from 'typeorm';
import { FormAnswer } from '../entities/form-answer.entity';
import { FormAssignment } from '../entities/form-assignment.entity';
import { FormOption } from '../entities/form-option.entity';
import { FormQuestion } from '../entities/form-question.entity';
import { FormResponse } from '../entities/form-response.entity';
import { FormResult } from '../entities/form-result.entity';
import { FormSession } from '../entities/form-session.entity';
import { FormTemplate } from '../entities/form-template.entity';
import { TemplateService } from './template.service';

describe('TemplateService', () => {
  const template = { id: 'template-id' } as FormTemplate;
  const repositories = new Map<Function, Record<string, jest.Mock>>();
  const templateRepo = { findOne: jest.fn(), delete: jest.fn() };
  const responseRepo = { find: jest.fn(), delete: jest.fn() };
  const sessionRepo = { find: jest.fn(), delete: jest.fn() };
  const answerRepo = { delete: jest.fn() };
  const resultRepo = { delete: jest.fn() };
  const assignmentRepo = { delete: jest.fn() };
  const questionRepo = { find: jest.fn(), delete: jest.fn() };
  const optionRepo = { delete: jest.fn() };
  const manager = {
    getRepository: jest.fn((entity: Function) => repositories.get(entity)),
  };
  const dataSource = {
    transaction: jest.fn((callback: (transactionManager: typeof manager) => unknown) =>
      callback(manager),
    ),
  };

  let service: TemplateService;

  beforeEach(() => {
    jest.clearAllMocks();
    repositories.clear();
    repositories.set(FormTemplate, templateRepo);
    repositories.set(FormResponse, responseRepo);
    repositories.set(FormSession, sessionRepo);
    repositories.set(FormAnswer, answerRepo);
    repositories.set(FormResult, resultRepo);
    repositories.set(FormAssignment, assignmentRepo);
    repositories.set(FormQuestion, questionRepo);
    repositories.set(FormOption, optionRepo);

    templateRepo.findOne.mockResolvedValue(template);
    responseRepo.find.mockResolvedValue([]);
    sessionRepo.find.mockResolvedValue([]);
    questionRepo.find.mockResolvedValue([]);

    service = new TemplateService(
      {} as Repository<FormTemplate>,
      {} as Repository<FormQuestion>,
      {} as Repository<FormOption>,
      dataSource as unknown as DataSource,
    );
  });

  it('deletes assignments, responses, sessions, results, and questions before the template', async () => {
    responseRepo.find.mockResolvedValue([{ id: 'response-id' }]);
    sessionRepo.find.mockResolvedValue([{ id: 'session-id' }]);
    questionRepo.find.mockResolvedValue([{ id: 'question-id' }]);

    await service.remove(template.id);

    expect(answerRepo.delete).toHaveBeenCalledWith([
      { response_id: expect.anything() },
      { session_id: expect.anything() },
      { question_id: expect.anything() },
    ]);
    expect(resultRepo.delete).toHaveBeenCalled();
    expect(responseRepo.delete).toHaveBeenCalled();
    expect(sessionRepo.delete).toHaveBeenCalled();
    expect(assignmentRepo.delete).toHaveBeenCalledWith({
      template_id: template.id,
    });
    expect(optionRepo.delete).toHaveBeenCalled();
    expect(questionRepo.delete).toHaveBeenCalledWith({
      template_id: template.id,
    });
    expect(templateRepo.delete).toHaveBeenCalledWith({ id: template.id });
  });

  it('deletes the template and assignments when it has no responses or sessions', async () => {
    await service.remove(template.id);

    expect(assignmentRepo.delete).toHaveBeenCalledWith({
      template_id: template.id,
    });
    expect(responseRepo.delete).not.toHaveBeenCalled();
    expect(sessionRepo.delete).not.toHaveBeenCalled();
    expect(templateRepo.delete).toHaveBeenCalledWith({ id: template.id });
  });
});
