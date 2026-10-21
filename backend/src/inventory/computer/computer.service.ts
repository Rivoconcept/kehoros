import { Injectable, NotFoundException } from '@nestjs/common';
import { Computers } from './entities/computer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddComputerDto } from './dto/add-computer.dto';
import { UpdateComputerDto } from './dto/update-computer.dto';

@Injectable()
export class ComputerService {
    constructor(@InjectRepository(Computers) private computersRepo: Repository<Computers>) {}


    async getComputers(): Promise<Computers[]> {
        return await this.computersRepo.find();
    }

    async addComputer(computer: AddComputerDto): Promise<Computers> {
        return await this.computersRepo.save(computer);

    }

    async updateComputer(label: string, updateComputerDto: UpdateComputerDto): Promise<Computers> {

        const existingComputer = await this.computersRepo.findOneBy({ label });

        if (!existingComputer) {
            throw new NotFoundException(`Computer with label "${label}" not found`);
        }

        this.computersRepo.merge(existingComputer, updateComputerDto);

        return await this.computersRepo.save(existingComputer);
    }
}
