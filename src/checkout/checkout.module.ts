import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigService],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
