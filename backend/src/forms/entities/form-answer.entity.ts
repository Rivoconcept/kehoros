import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn
} from 'typeorm';
import { FormSession } from './form-session.entity';
import { FormQuestion } from './form-question.entity';

@Entity('form_answers')
export class FormAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  session_id: string;

  @ManyToOne(() => FormSession, s => s.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: FormSession;

  @Column()
  question_id: string;

  @ManyToOne(() => FormQuestion, q => q.answers)
  @JoinColumn({ name: 'question_id' })
  question: FormQuestion;

  @Column({ nullable: true })
  answer_text: string;

  @Column({ type: 'jsonb', nullable: true })
  answer_json: any;

  @Column({ nullable: true })
  is_correct: boolean;

  @CreateDateColumn()
  answered_at: Date;
}