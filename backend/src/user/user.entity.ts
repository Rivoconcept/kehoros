import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { Department } from './department.entity';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

@Entity('users')
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({
    nullable: true,
    unique: true,
  })
  matricule?: string;

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
  manager_id?: string;

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

