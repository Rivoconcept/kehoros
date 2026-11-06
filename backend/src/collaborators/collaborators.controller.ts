import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CollaboratorService } from './collaborators.service';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';
import { Collaborators } from './entities/collaborators.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/user/entities/user.entity';
import { Roles } from 'src/auth/roles.decorator';

@Controller('collaborators')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CollaboratorController {
  constructor(private readonly collaboratorService: CollaboratorService) {}

  @Get()
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  async findAll(): Promise<Collaborators[]> {
    return await this.collaboratorService.getCollab();
  }

  @Get(':matricule')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  async findOne(@Param('matricule') matricule: string): Promise<Collaborators> {
    return await this.collaboratorService.findByMatricule(matricule);
  }

  @Post('import')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  async bulkImport(@Body() dtos: CreateCollaboratorDto[]) {
    return await this.collaboratorService.bulkImport(dtos);
  }

  @Post()
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  async create(@Body() dto: CreateCollaboratorDto) {
    return await this.collaboratorService.create(dto);
  }

  @Patch(':matricule')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  async update(@Param('matricule') matricule: string, @Body() dto: UpdateCollaboratorDto) {
    return await this.collaboratorService.update(matricule, dto);
  }

  @Delete(':matricule')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  async remove(@Param('matricule') matricule: string) {
    return await this.collaboratorService.remove(matricule);
  }
}
