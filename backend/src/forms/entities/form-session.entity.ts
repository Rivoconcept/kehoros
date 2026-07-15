import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany, JoinColumn, CreateDateColumn
} from 'typeorm';
import { FormTemplate } from './form-template.entity';
import { User } from '../../user/user.entity';
import { FormAnswer } from './form-answer.entity';

export enum SessionStatus {
  IN_PROGRESS = 'in_progress',
  SUBMITTED   = 'submitted',
  TIMED_OUT   = 'timed_out',
}

@Entity('form_sessions')
export class FormSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  form_id: string;

  @ManyToOne(() => FormTemplate, f => f.sessions)
  @JoinColumn({ name: 'form_id' })
  form: FormTemplate;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: SessionStatus, default: SessionStatus.IN_PROGRESS })
  status: SessionStatus;

  @Column({ nullable: true })
  score: number;

  @CreateDateColumn()
  started_at: Date;

  @Column({ nullable: true })
  submitted_at: Date;

  @OneToMany(() => FormAnswer, a => a.session, { cascade: true })
  answers: FormAnswer[];
}