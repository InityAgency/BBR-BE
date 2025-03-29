import { Module } from '@nestjs/common';
import { UnitTypeController } from './ui/unit-type.controller';

@Module({
  imports: [],
  controllers: [UnitTypeController],
  providers: [],
  exports: [],
})
export class UnitTypeModule {}
