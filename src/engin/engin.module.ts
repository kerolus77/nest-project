import { Module } from '@nestjs/common';
import { EnginService } from './engin.service.js';
import { BatteryModule } from '../battery/battery.module.js';

@Module({
  providers: [EnginService],
  imports:[BatteryModule],
  exports:[EnginService]
})
export class EnginModule {}
