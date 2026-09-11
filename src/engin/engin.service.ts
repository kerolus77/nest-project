import { Injectable } from '@nestjs/common';
import { BatteryService } from '../battery/battery.service.js';

@Injectable()
export class EnginService {
    constructor(private readonly batteryService: BatteryService) {}

    start(): string {
        const powerStatus = this.batteryService.powerSupply();
        return `Engin started. ${powerStatus}`;
    }
    
}
