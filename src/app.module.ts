import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module.js';
import { CarModule } from './car/car.module.js';
import { BatteryModule } from './battery/battery.module.js';
import { EnginModule } from './engin/engin.module.js';
import { ConditionerModule } from './conditioner/conditioner.module.js';

@Module({
  imports: [UsersModule, CarModule, BatteryModule, EnginModule, ConditionerModule],
})

export class AppModule {}