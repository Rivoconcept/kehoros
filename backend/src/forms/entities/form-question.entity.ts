import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany, JoinColumn
} from 'typeorm';
import { FormTemplate } from './form-template.entity';
import { FormQuestionOption } from './form-question-option.entity';
import { FormAnswer } from './form-answer.entity';

export enum QuestionType {
  TEXT      = 'text',
  TEXTAREA  = 'textarea',
  RADIO     = 'radio',
  CHECKBOX  = 'checkbox',
  SELECT    = 'select',
  NUMBER    = 'number',
  DATE      = 'date',
  FILE      = 'file',
  RATING    = 'rating',
}

@Entity('form_questions')
export class FormQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  form_id: string;

  @ManyToOne(() => FormTemplate, f => f.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'form_id' })
  form: FormTemplate;

  @Column()
  label: string;

  @Column({ type: 'enum', enum: QuestionType, default: QuestionType.TEXT })
  type: QuestionType;

  @Column({ default: false })
  required: boolean;

  @Column({ default: 0 })
  order_index: number;

  @Column({ type: 'jsonb', nullable: true })
  settings: Record<string, any>;

  @OneToMany(() => FormQuestionOption, o => o.question, { cascade: true })
  options: FormQuestionOption[];

  @OneToMany(() => FormAnswer, a => a.question)
  answers: FormAnswer[];
}