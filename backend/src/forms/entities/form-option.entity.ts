import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { FormQuestion } from './form-question.entity';

@Entity('form_options')
export class FormOption {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  Question_id: string;

  @ManyToOne(() => FormQuestion, q => q.options, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'Question_id' })
  Question: FormQuestion;

  @Column()
  label: string;

  @Column()
  value: string;

  @Column({ default: false })
  is_correct: boolean;

  @Column({ default: 0 })
  position: number;

}