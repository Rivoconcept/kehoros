import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { FormTemplate } from './form-template.entity';
import { User } from '../../user/user.entity';

@Entity('form_assignments')
export class FormAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  template_id: string;

  @Column({ type: 'uuid', nullable: true })
  user_id: string;

  @Column({ type: 'uuid', nullable: true })
  assigned_by?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  deadline: Date;

  @Column({ type: 'varchar', default: 'pending' })
  status: string;

  @CreateDateColumn()
  assigned_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date;

  // --- RELATIONS ---

  @ManyToOne(() => FormTemplate, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'template_id' })
  template: FormTemplate;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'assigned_by' })
  assigner: User;
}