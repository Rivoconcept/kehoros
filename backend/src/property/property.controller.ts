import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { PropertyService } from "./property.service";

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()                          // GET /properties
  findAll() {
    return 'this.propertyService.findAll()';
  }

  @Get(':id')                     // GET /properties/uuid-ici
  findOne(@Param('id') id: string) {
    console.log(typeof id);
    return this.propertyService.findOne(id);
  }

//   @Post()                         // POST /properties
//   create(@Body() body: CreatePropertyDto) {
//     return this.propertyService.create(body);
//   }

//   @Delete(':id')                  // DELETE /properties/uuid-ici
//   remove(@Param('id') id: string) {
//     return this.propertyService.remove(id);
//   }
}