import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TimestampEntities } from 'src/generics/timestamp.entities';
import { Computers } from 'src/inventory/computer/entities/computer.entity';

@Entity('collaborators')
export class Collaborators extends TimestampEntities {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, name: 'matricule' })
  matricule: string;

  @Column({ name: 'nom' })
  nom: string;

  @Column({ name: 'prenoms', nullable: true })
  prenoms: string;

  @Column({ unique: true, name: 'email' })
  email: string;

  @Column({ nullable: true, name: 'fonction' })
  fonction: string;

  @Column({ nullable: true, name: 'niveau' })
  niveau: string;

  @Column({ nullable: true, name: 'pole' })
  pole: string;

  @Column({ nullable: true, name: 'departement' })
  departement: string;

  @Column({ nullable: true, name: 'manager' })
  manager: string;

  @Column({ nullable: true, name: 'supervisor' })
  supervisor: string;

  @Column({ nullable: true, name: 'pays' })
  pays: string;

  @Column({ nullable: true, name: 'equipe_fr' })
  equipeFr: string;

  @Column({ nullable: true, name: 'verticale' })
  verticale: string;

  @Column({ type: 'boolean', default: false, name: 'acces_drive' })
  accesDrive: boolean;

  @Column({ type: 'boolean', default: false, name: 'ability_delegation' })
  abilityDelegation: boolean;

  @Column({ nullable: true, name: 'delegated_mail' })
  delegatedMail: string;

  @Column({ type: 'text', nullable: true })
  noticed: string;

  @OneToMany(() => Computers, (computer) => computer.collaborator)
  computers: Computers[];
}

