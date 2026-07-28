import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

import { ResultStatus } from '../enums/result-status.enum';

@Entity('form_results')
export class FormResult {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  response_id: string;

  @Column({
    default: 0,
  })
  score: number;

  @Column({
    default: 0,
  })
  max_score: number;

  @Column({
    default: 0,
  })
  percentage: number;

  @Column({
    type: 'enum',
    enum: ResultStatus,
    default: ResultStatus.PENDING,
  })
  status: ResultStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  comment: string;

  @Column({
    nullable: true,
  })
  graded_by: string;

  @Column({
    nullable: true,
  })
  graded_at: Date;

}