import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { FormTemplate } from './form-template.entity';
import { User } from '../../user/user.entity';

@Entity('form_assignments')
export class FormAssignment {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  template_id: string;

  @ManyToOne(() => FormTemplate, t => t.assignments)
  @JoinColumn({ name: 'template_id' })
  template: FormTemplate;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  assigned_by: string;

  @CreateDateColumn()
  assigned_at: Date;

  @Column({
    nullable: true,
  })
  deadline: Date;

  @Column({
    default: 'pending',
  })
  status: string;

  @Column({
    nullable: true,
  })
  completed_at: Date;

}