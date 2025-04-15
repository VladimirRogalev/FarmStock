import { Module } from '@nestjs/common';
import { SurpriseBagService } from './surprise-bag.service';
import { SurpriseBagController } from './surprise-bag.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [SurpriseBagController],
  providers: [SurpriseBagService, PrismaService],
})
export class SurpriseBagModule {}
