import { Injectable } from '@nestjs/common';

import { AssignmentService } from './assignment.service';
import { ResponseService } from './response.service';
import { ResultService } from './result.service';
import { TemplateService } from './template.service';
import { QuestionService } from './question.service';

@Injectable()
export class FormsService {
  constructor(
    private readonly templateService: TemplateService,
    private readonly questionService: QuestionService,
    private readonly assignmentService: AssignmentService,
    private readonly responseService: ResponseService,
    private readonly resultService: ResultService,
  ) {}

  // Template orchestration
  createTemplate(input: Parameters<TemplateService['create']>[0]) {
    return this.templateService.create(input);
  }

  findAllTemplates() {
    return this.templateService.findAll();
  }

  findTemplateById(id: string) {
    return this.templateService.findOne(id);
  }

  updateTemplate(id: string, input: Parameters<TemplateService['update']>[1]) {
    return this.templateService.update(id, input);
  }

  publishTemplate(id: string) {
    return this.templateService.publish(id);
  }

  archiveTemplate(id: string) {
    return this.templateService.archive(id);
  }

  duplicateTemplate(id: string, overrides?: Parameters<TemplateService['duplicate']>[1]) {
    return this.templateService.duplicate(id, overrides);
  }

  removeTemplate(id: string) {
    return this.templateService.remove(id);
  }

  // Assignment orchestration
  assignTemplate(input: Parameters<AssignmentService['assign']>[0]) {
    return this.assignmentService.assign(input);
  }

  findAssignments() {
    return this.assignmentService.findAll();
  }

  findAssignmentsByUser(userId: string) {
    return this.assignmentService.findByUser(userId);
  }

  findAssignmentsByTemplate(templateId: string) {
    return this.assignmentService.findByTemplate(templateId);
  }

  updateAssignmentStatus(id: string, status: string) {
    return this.assignmentService.updateStatus(id, status);
  }

  renewAssignment(id: string, deadline?: Date | string) {
    return this.assignmentService.renew(id, deadline);
  }

  cancelAssignment(id: string) {
    return this.assignmentService.cancel(id);
  }

  // Response orchestration
  startResponse(input: Parameters<ResponseService['start']>[0]) {
    return this.responseService.start(input);
  }

  saveDraft(input: Parameters<ResponseService['saveDraft']>[0]) {
    return this.responseService.saveDraft(input);
  }

  submitResponse(input: Parameters<ResponseService['submit']>[0]) {
    return this.responseService.submit(input);
  }

  findResponsesByAssignment(assignmentId: string) {
    return this.responseService.findByAssignment(assignmentId);
  }

  // Result orchestration
  evaluateResponse(responseId: string, gradedBy?: string) {
    return this.resultService.evaluate(responseId, gradedBy);
  }

  findResultsByResponse(responseId: string) {
    return this.resultService.findByResponse(responseId);
  }

  updateResultStatus(id: string, status: Parameters<ResultService['updateStatus']>[1]) {
    return this.resultService.updateStatus(id, status);
  }

  // Question orchestration
  createQuestion(input: Parameters<QuestionService['createQuestion']>[0]) {
    return this.questionService.createQuestion(input);
  }

  findQuestionsByTemplate(templateId: string) {
    return this.questionService.findByTemplate(templateId);
  }

  findQuestionById(id: string) {
    return this.questionService.findOne(id);
  }

  updateQuestion(id: string, input: Parameters<QuestionService['updateQuestion']>[1]) {
    return this.questionService.updateQuestion(id, input);
  }

  removeQuestion(id: string) {
    return this.questionService.removeQuestion(id);
  }

  createOption(input: Parameters<QuestionService['createOption']>[0]) {
    return this.questionService.createOption(input);
  }

  updateOption(id: string, input: Parameters<QuestionService['updateOption']>[1]) {
    return this.questionService.updateOption(id, input);
  }

  removeOption(id: string) {
    return this.questionService.removeOption(id);
  }
}
