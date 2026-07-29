import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FormSession } from './form-session.entity';

@Entity('form_answers')
export class FormAnswer {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  response_id: string;

  @Column()
  session_id: string;

  @ManyToOne(() => FormSession, (session) => session.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: FormSession;

  @Column()
  question_id: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  answer_text: string;

  @Column({
    nullable: true,
  })
  answer_number: number;

  @Column({
    nullable: true,
  })
  answer_boolean: boolean;

  @Column({
    nullable: true,
  })
  selected_option_id: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  json_value: any;

}


/*import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn
} from 'typeorm';
import { FormSession } from './form-session.entity';
import { FormQuestion } from './form-Question.entity';

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
  Question_id: string;

  @ManyToOne(() => FormQuestion, q => q.answers)
  @JoinColumn({ name: 'Question_id' })
  Question: FormQuestion;

  @Column({ nullable: true })
  answer_text: string;

  @Column({ type: 'jsonb', nullable: true })
  answer_json: any;

  @Column({ nullable: true })
  is_correct: boolean;

  @CreateDateColumn()
  answered_at: Date;
}*/