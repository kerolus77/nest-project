import { Injectable } from '@nestjs/common';
import { EnginService } from '../engin/engin.service.js';

@Injectable()
export class ConditionerService {
    constructor( 
        private readonly enginService: EnginService) {}

        on(): string {
            const enginStatus = this.enginService.start();
            return `Conditioner is on.  ${enginStatus}`;
        }
}
