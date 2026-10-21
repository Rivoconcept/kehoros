import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID } from 'class-validator';

export enum AssetStatus {
  IN_USE = 'IN_USE',
  IN_STOCK = 'IN_STOCK',
  REPAIR = 'REPAIR',
  RETIRED = 'RETIRED',
}

export class CreateInventoryDto {
  @IsString()
  @IsNotEmpty()
  assetTag: string; // Ex: AST-2026-001 (Tag QR ou Code Barre unique)

  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsString()
  @IsNotEmpty()
  name: string; // Ex: PC Portable Dell Latitude 5530

  @IsString()
  @IsNotEmpty()
  category: string; // Ex: LAPTOP, DESKTOP, SCREEN, PRINTER, NETWORK

  @IsString()
  @IsOptional()
  brand?: string; // Ex: Dell, HP, Lenovo

  @IsString()
  @IsOptional()
  model?: string;

  @IsEnum(AssetStatus)
  @IsOptional()
  status?: AssetStatus;

  @IsUUID()
  @IsOptional()
  userId?: string; // UUID de l'utilisateur assigné (User entity)

  @IsUUID()
  @IsOptional()
  departmentId?: string; // UUID du département (Department entity)

  @IsString()
  @IsOptional()
  location?: string; // Ex: Siège Antananarivo - Bureau 302
}