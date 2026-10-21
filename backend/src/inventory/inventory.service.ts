import { Injectable } from '@nestjs/common';

@Injectable()
export class InventoryService {
    getInventory(): string {
        return 'Hello World!';
    }
}
