import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, OneToMany, JoinColumn
} from 'typeorm';
import { User } from '../../user/user.entity';
import { FormQuestion } from './form-question.entity';
import { FormSession } from './form-session.entity';

@Entity('form_templates')
export class FormTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  created_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @Column({ default: false })
  is_published: boolean;

  @Column({ default: false })
  is_exam: boolean;

  @Column({ nullable: true })
  time_limit_minutes: number;

  @Column({ default: false })
  shuffle_questions: boolean;

  @Column({ default: true })
  show_results: boolean;

  @Column({ nullable: true })
  starts_at: Date;

  @Column({ nullable: true })
  ends_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => FormQuestion, q => q.form, { cascade: true })
  questions: FormQuestion[];

  @OneToMany(() => FormSession, s => s.form)
  sessions: FormSession[];
}