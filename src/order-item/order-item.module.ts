import { Module } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [OrderItemService, PrismaService],
  controllers: [OrderItemController],
})
export class OrderItemModule {}
