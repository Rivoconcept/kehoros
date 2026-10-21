import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {

    constructor(private readonly inventoryService : InventoryService) {}

    // @Get()
    // getInventory(): string {
    //     return this.inventoryService.getInventory();
    // }

    @Get()
    findAll() {
        return "All Properties"
    }

    // @Get(":id")
    // findOne(@Param("id") id : string) {
    //     return id;
    // }

    // @Post()
    // create(@Body("name") name) {
    //     return  name;
    // }
 
    // @Patch()
    // update() {
    //     return "This will update a property";
    // }

}
