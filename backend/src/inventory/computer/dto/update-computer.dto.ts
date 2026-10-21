import { PartialType } from '@nestjs/mapped-types';
import { AddComputerDto } from './add-computer.dto';

export class UpdateComputerDto extends PartialType(AddComputerDto) {}