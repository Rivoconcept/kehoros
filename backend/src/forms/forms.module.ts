import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormTemplate } from '../forms/entities/form-template.entity';
import { FormQuestion } from '../forms/entities/form-question.entity';
import { FormSession } from '../forms/entities/form-session.entity';
import { FormAnswer } from '../forms/entities/form-answer.entity';

import { TemplateService } from './services/template.service';
import { FormOption } from './entities/form-option.entity';
import { AssignmentService } from './services/assignment.service';
import { ResponseService } from './services/response.service';
import { ResultService } from './services/result.service';
import { QuestionService } from './services/question.service';
import { User } from '../user/user.entity';
import { RolesGuard } from '../auth/roles.guard';
import { FormAssignment } from './entities/form-assignment.entity';
import { FormResponse } from './entities/form-response.entity';
import { FormResult } from './entities/form-result.entity';
import { FormsController } from './controllers/forms.controller';
import { FormsService } from './services/forms.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FormTemplate,
      FormQuestion,
      FormOption,
      FormAssignment,
      FormSession,
      FormAnswer,
      FormResponse,
      FormResult,
      User,
    ]),
  ],
  controllers: [FormsController],
  providers: [
    FormsService,
    TemplateService,
    QuestionService,
    AssignmentService,
    ResponseService,
    ResultService,
    RolesGuard,
  ],
  exports: [
    FormsService,
    TemplateService,
    QuestionService,
    AssignmentService,
    ResponseService,
    ResultService,
  ],
})
export class FormsModule {}