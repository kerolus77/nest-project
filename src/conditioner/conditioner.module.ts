import { Module } from '@nestjs/common';
import { ConditionerService } from './conditioner.service.js';
import { EnginModule } from '../engin/engin.module.js';

@Module({
  providers: [ConditionerService],
  imports:[EnginModule],
  exports:[ConditionerService]
})
export class ConditionerModule {}
