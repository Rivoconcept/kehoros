import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID, IsDate } from 'class-validator';
import { AssetStatus } from 'src/inventory/dto/createInventory.dto';
import { ComputerType } from 'src/inventory/enums/computer-type.enum';
import { TechnicalStatus } from 'src/inventory/enums/technical-status.enum';


export class AddComputerDto {
  @IsString()
  @IsOptional()
  entity?: string; // Société propriétaire

  @IsEnum(ComputerType)
  @IsOptional()
  type?: ComputerType; // LAPTOP, DESKTOP, SERVER

  @IsString()
  @IsOptional()
  brand?: string; // HP, Dell...

  @IsString()
  @IsOptional()
  model?: string; // Probook 450, ThinkPad...

  @IsString()
  @IsOptional()
  processor?: string;

  @IsString()
  @IsOptional()
  ram?: string;

  @IsString()
  @IsOptional()
  storageCapacity?: string;

  @IsString()
  @IsOptional()
  osVersion?: string;

  @IsString()
  @IsNotEmpty()
  label: string; // Ex: L2022160 (Hostname / Nom du PC)

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  purchaseDate?: Date;

  @IsUUID()
  @IsOptional()
  userId?: string; // Matricule / ID de l'utilisateur (lié à la table user)

  @IsString()
  @IsOptional()
  location?: string; // Bureau, bâtiment, pays

  @IsEnum(AssetStatus)
  @IsOptional()
  status?: AssetStatus;

  @IsEnum(TechnicalStatus)
  @IsOptional()
  technicalStatus?: TechnicalStatus;
}