import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';

import { Department } from '../../user-department/entities/user-department.entity';
import { Collaborators } from '../../collaborators/entities/collaborators.entity';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

@Entity('users')
@Index('UQ_users_collaborator_id', ['collaborator_id'], { unique: true })
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ type: 'varchar', nullable: true, select: false })
  recovery_code_hash?: string | null;

  @Column({ type: 'boolean', default: true })
  two_factor_enabled: boolean;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({
    nullable: true,
    unique: true,
  })
  matricule?: string;

  @Column({ type: 'uuid', nullable: true })
  collaborator_id?: string | null;

  @OneToOne(() => Collaborators, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'collaborator_id',
    foreignKeyConstraintName: 'FK_users_collaborator_id',
  })
  collaborator?: Collaborators | null;

  @Column({
    nullable: true,
  })
  phone?: string;

  @Column({
    nullable: true,
  })
  department_id?: string;

  @ManyToOne(() => Department, department => department.users, {
    nullable: true,
  })
  @JoinColumn({ name: 'department_id' })
  department?: Department;

  @Column({
    nullable: true,
  })
  manager_id?: string | null;

  @ManyToOne(() => User, user => user.directReports, {
    nullable: true,
  })
  @JoinColumn({ name: 'manager_id' })
  manager?: User;

  @OneToMany(() => User, user => user.manager)
  directReports?: User[];

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    default: true,
  })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;
}
