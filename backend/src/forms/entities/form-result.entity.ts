import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ResultStatus } from '../enums/result-status.enum';
import { FormResponse } from './form-response.entity';

@Entity('form_results')
export class FormResult {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  response_id: string;

  @ManyToOne(() => FormResponse, (response) => response.results, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'response_id' })
  response: FormResponse;

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