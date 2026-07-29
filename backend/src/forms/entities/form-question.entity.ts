import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { FormTemplate } from './form-template.entity';
import { FormOption } from './form-option.entity';
import { QuestionType } from '../enums/question-type.enum';

@Entity('form_Questions')
export class FormQuestion {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  template_id: string;

  @ManyToOne(() => FormTemplate, t => t.Questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'template_id' })
  template: FormTemplate;

  @Column()
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: QuestionType,
  })
  type: QuestionType;

  @Column({ default: false })
  required: boolean;

  @Column({ default: 0 })
  position: number;

  @Column({ default: 0 })
  points: number;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  settings: any;

  @OneToMany(() => FormOption, o => o.Question)
  options: FormOption[];

}