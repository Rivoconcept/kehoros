import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('properties')         // ← nom de la table dans PostgreSQL
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;                 // ← colonne id UUID

  @Column()
  name: string;               // ← colonne name VARCHAR

  @Column({ nullable: true })
  address: string;            // ← colonne address, peut être NULL

  @CreateDateColumn()
  created_at: Date;           // ← colonne créée automatiquement
}