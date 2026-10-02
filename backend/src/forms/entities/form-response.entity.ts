import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { FormTemplate } from './form-template.entity';
import { FormResult } from './form-result.entity';
import { User } from '../../user/user.entity';

@Entity('form_responses')
// Syntaxe correcte TypeORM pour l'index GIN sur JSONB
@Index('idx_form_responses_answers_gin', ['answers'])
export class FormResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'template_id', type: 'uuid' })
  template_id: string;

  @Column({ name: 'assignment_id', type: 'uuid', nullable: true })
  assignment_id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  user_id: string;

  @Column({ type: 'varchar', default: 'SUBMITTED' })
  status: string;

  // Réponses stockées au format JSONB
  @Column({ type: 'jsonb', default: {} })
  answers: Record<string, any>;

  // Propriétés de suivi temporel requises par ResponseService
  @Column({ type: 'timestamp', nullable: true })
  started_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  submitted_at: Date;

  @Column({ type: 'integer', nullable: true })
  duration_seconds: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => FormTemplate)
  @JoinColumn({ name: 'template_id' })
  template: FormTemplate;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => FormResult, (result) => result.response)
  results!: FormResult[];
}