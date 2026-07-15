import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn
} from 'typeorm';
import { FormQuestion } from './form-question.entity';

@Entity('form_question_options')
export class FormQuestionOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  question_id: string;

  @ManyToOne(() => FormQuestion, q => q.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: FormQuestion;

  @Column()
  label: string;

  @Column()
  value: string;

  @Column({ default: false })
  is_correct: boolean;

  @Column({ default: 0 })
  order_index: number;
}