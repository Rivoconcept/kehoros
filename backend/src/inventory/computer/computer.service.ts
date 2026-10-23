import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Computers } from './entities/computer.entity';
import { AddComputerDto } from './dto/add-computer.dto';
import { UpdateComputerDto } from './dto/update-computer.dto';

@Injectable()
export class ComputerService {
    constructor(
        @InjectRepository(Computers) 
        private readonly computersRepo: Repository<Computers>
    ) {}

    // Récupérer tous les ordinateurs
    async getComputers(): Promise<Computers[]> {
        return await this.computersRepo.find();
    }

    // Récupérer un ordinateur spécifique par son label
    async getComputerByLabel(label: string): Promise<Computers> {
        const computer = await this.computersRepo.findOneBy({ label });

        if (!computer) {
            throw new NotFoundException(`Computer with label "${label}" not found`);
        }

        return computer;
    }

    // Ajouter un ordinateur
    async addComputer(addComputerDto: AddComputerDto): Promise<Computers> {
        const newComputer = this.computersRepo.create(addComputerDto);
        return await this.computersRepo.save(newComputer);
    }

    // Mettre à jour un ordinateur par son label
    async updateComputer(label: string, updateComputerDto: UpdateComputerDto): Promise<Computers> {
        const existingComputer = await this.getComputerByLabel(label);

        this.computersRepo.merge(existingComputer, updateComputerDto);
        return await this.computersRepo.save(existingComputer);
    }

    // Supprimer un ordinateur par son label
    async removeComputer(label: string): Promise<Computers> {
        const computerToRemove = await this.getComputerByLabel(label);
        return await this.computersRepo.remove(computerToRemove);
    }

    // 🚀 Utilisation du QueryBuilder pour des statistiques avancées
    async statComputerByLabel() {
        const queryBuilderStat = this.computersRepo.createQueryBuilder('computer');

        // console.log(queryBuilderStat.getSql());

        // Nombre total d'ordinateurs
        const totalCount = await queryBuilderStat.getCount();

        // Répartition par type (LAPTOP, DESKTOP, SERVER) via QueryBuilder
        const statsByType = await this.computersRepo
            .createQueryBuilder('computer')
            .select('computer.type', 'type')
            .addSelect('COUNT(computer.id)', 'count')
            .groupBy('computer.type')
            .getRawMany();

        // Répartition par statut
        const statsByStatus = await this.computersRepo
            .createQueryBuilder('computer')
            .select('computer.status', 'status')
            .addSelect('COUNT(computer.id)', 'count')
            .groupBy('computer.status')
            .getRawMany();

        return {
            total: totalCount,
            byType: statsByType,
            byStatus: statsByStatus,
        };
    }



}