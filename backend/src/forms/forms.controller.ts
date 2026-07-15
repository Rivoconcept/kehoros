import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { FormsService } from './forms.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('forms')
@UseGuards(JwtAuthGuard)
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Get()
  findAll() {
    return this.formsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formsService.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.formsService.create(body);
  }
}