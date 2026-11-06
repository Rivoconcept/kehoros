import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AssetStatus } from '../../dto/createInventory.dto';
import { ComputerType } from '../../enums/computer-type.enum';
import { TechnicalStatus } from '../../enums/technical-status.enum';
import { TimestampEntities } from 'src/generics/timestamp.entities';
import { Collaborators } from 'src/collaborators/entities/collaborators.entity';

@Entity('computers')
export class Computers extends TimestampEntities {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'entity', nullable: true })
  entity: string; // Société propriétaire

  @Column({
    type: 'enum',
    enum: ComputerType,
    default: ComputerType.LAPTOP,
    nullable: true,
  })
  type: ComputerType;

  @Column({ nullable: true })
  brand: string; // HP, Dell...

  @Column({ nullable: true })
  model: string; // Probook 450, ThinkPad...

  @Column({ nullable: true })
  processor: string;

  @Column({ nullable: true })
  ram: string;

  @Column({ nullable: true, name: 'storage_capacity' })
  storageCapacity: string;

  @Column({ nullable: true, name: 'os_version' })
  osVersion: string;

  @Column({ unique: true, name: 'label' })
  label: string; // Ex: L2022160

  @Column({ type: 'date', nullable: true, name: 'purchase_date' })
  purchaseDate: Date;

  // 🔗 Liaison avec Collaborators
  @Column({ nullable: true, name: 'collaborator_id' })
  collaboratorId: string;

  @ManyToOne(() => Collaborators, (collaborator: Collaborators) => collaborator.computers, { 
    onDelete: 'SET NULL', 
    nullable: true 
  })
  @JoinColumn({ name: 'collaborator_id' })
  collaborator: Collaborators;

  @Column({ nullable: true })
  location: string; // Bureau, bâtiment, pays

  @Column({
    type: 'enum',
    enum: AssetStatus,
    default: AssetStatus.IN_USE,
    nullable: true,
  })
  status: AssetStatus;

  @Column({
    type: 'enum',
    enum: TechnicalStatus,
    default: TechnicalStatus.FUNCTIONAL,
    nullable: true,
    name: 'technical_status',
  })
  technicalStatus: TechnicalStatus;
}