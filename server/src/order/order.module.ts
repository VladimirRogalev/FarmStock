import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from '../prisma.service';
import { PayPalService } from '../paypal/paypal.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService, PayPalService],
})
export class OrderModule {}
