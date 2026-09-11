import { Module } from '@nestjs/common';
import { CarController } from './car.controller.js';
import { ConditionerModule } from '../conditioner/conditioner.module.js';
import { EnginModule } from '../engin/engin.module.js';

@Module({
  controllers: [CarController],
  imports: [
    EnginModule,
    ConditionerModule
  ],
})
export class CarModule {}
