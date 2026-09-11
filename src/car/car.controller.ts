import { Controller, Get } from '@nestjs/common';
import { ConditionerService } from '../conditioner/conditioner.service.js';
import { EnginService } from '../engin/engin.service.js';

@Controller('car')
export class CarController {
constructor(private readonly conditionService: ConditionerService,
    private readonly enginService: EnginService,
) {}
    @Get()
    move(): string[] {
        
        return [
this.enginService.start(),
 this.conditionService.on()
        ];
    }
}
