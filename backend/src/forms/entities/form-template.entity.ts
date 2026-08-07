import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { User } from '../../user/user.entity';
import { FormQuestion } from './form-question.entity';
import { FormAssignment } from './form-assignment.entity';
import { FormSession } from './form-session.entity';
import { FormStatus } from '../enums/form-status.enum';

@Entity('form_templates')
export class FormTemplate {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  category: string;

  @Column({
    type: 'enum',
    enum: FormStatus,
    default: FormStatus.DRAFT,
  })
  status: FormStatus;

  @Column({ default: false })
  is_public: boolean;

  @Column({ nullable: true })
  duration_minutes: number;

  @Column({ nullable: true })
  pass_score: number;

  @Column()
  created_by: string;

  @OneToMany(() => FormQuestion, q => q.template)
  questions: FormQuestion[];

  @OneToMany(() => FormAssignment, a => a.template)
  assignments: FormAssignment[];

  @OneToMany(() => FormSession, s => s.form)
  sessions: FormSession[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}