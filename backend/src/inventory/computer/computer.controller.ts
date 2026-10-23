import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ComputerService } from './computer.service';
import { Computers } from './entities/computer.entity';
import { AddComputerDto } from './dto/add-computer.dto';
import { UpdateComputerDto } from './dto/update-computer.dto';

@Controller('inventory/computer')
export class ComputerController {
    constructor(private readonly computerService: ComputerService) {}

    @Get()
    async findAll(): Promise<Computers[]> {
        return await this.computerService.getComputers();
    }

    @Get('stats')
    async getStats() {
        return await this.computerService.statComputerByLabel();
    }

    @Get(':label')
    async findOne(@Param('label') label: string): Promise<Computers> {
        return await this.computerService.getComputerByLabel(label);
    }

    @Post()
    async addComputer(@Body() addComputerDto: AddComputerDto): Promise<Computers> {
        return await this.computerService.addComputer(addComputerDto);
    }
        
    @Patch(':label')
    async updateComputer(
        @Param('label') label: string, 
        @Body() updateComputerDto: UpdateComputerDto
    ): Promise<Computers> {
        return await this.computerService.updateComputer(label, updateComputerDto);
    }

    @Delete(':label')
    async removeComputer(@Param('label') label: string): Promise<Computers> {
        return await this.computerService.removeComputer(label);
    }
}