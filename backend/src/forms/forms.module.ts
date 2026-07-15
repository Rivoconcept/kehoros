import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormTemplate } from '../forms/entities/form-template.entity';
import { FormQuestion } from '../forms/entities/form-question.entity';
import { FormQuestionOption } from '../forms/entities/form-question-option.entity';
import { FormSession } from '../forms/entities/form-session.entity';
import { FormAnswer } from '../forms/entities/form-answer.entity';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FormTemplate,
      FormQuestion,
      FormQuestionOption,
      FormSession,
      FormAnswer,
    ]),
  ],
  controllers: [FormsController],
  providers: [FormsService],
  exports: [FormsService],
})
export class FormsModule {}