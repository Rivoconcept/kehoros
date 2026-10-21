import { Body, Controller, Get, HttpCode, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';

import { ComputerService } from './computer.service';
import { Computers } from './entities/computer.entity';
import { AddComputerDto } from './dto/add-computer.dto';
import { UpdateComputerDto } from './dto/update-computer.dto';
import { idText } from 'typescript';

@Controller('inventory/computer')
export class ComputerController {
    constructor( private computerService: ComputerService) {}

    @Get()
    async findAll(): Promise<Computers[]> {
        return await this.computerService.getComputers();
    }

    @Post()
    // @UsePipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}))
    // @HttpCode(202)
    async addComputer(@Param('id') idText: string, @Body() addComputerDto: AddComputerDto) {
        return await this.computerService.addComputer(addComputerDto);
    }
        
    @Patch(':label')
    async updateComputer(@Param('label') label: string, @Body() updateComputerDto: UpdateComputerDto): Promise<Computers> {
        return await this.computerService.updateComputer(label, updateComputerDto);
    }

}
