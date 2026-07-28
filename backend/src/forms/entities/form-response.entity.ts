import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('form_responses')
export class FormResponse {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  assignment_id: string;

  @Column()
  user_id: string;

  @CreateDateColumn()
  started_at: Date;

  @Column({
    nullable: true,
  })
  submitted_at: Date;

  @Column({
    nullable: true,
  })
  duration_seconds: number;

}