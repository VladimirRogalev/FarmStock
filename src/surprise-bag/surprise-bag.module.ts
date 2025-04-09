import { Module } from '@nestjs/common';
import { SurpriseBagService } from './surprise-bag.service';
import { SurpriseBagController } from './surprise-bag.controller';

@Module({
  controllers: [SurpriseBagController],
  providers: [SurpriseBagService],
})
export class SurpriseBagModule {}
