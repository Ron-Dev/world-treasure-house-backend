// src/modules/checkout/checkout.service.ts

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CheckoutDto } from './dto/checkout.dto';
import Razorpay from 'razorpay';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CheckoutService {
  private razorpay: Razorpay;
  private stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.config.get<string>('RAZORPAY_KEY_ID'),
      key_secret: this.config.get<string>('RAZORPAY_KEY_SECRET'),
    });

    const stripeSecretKey = this.config.get<string>('STRIPE_SECRET_KEY');

    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined in the environment');
    }

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-04-30.basil',
    });
  }

  async checkout(userId: string, dto: CheckoutDto) {
    // Get user cart
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Validate address
    const address = await this.prisma.address.findFirst({
      where: { id: dto.addressId, userId },
    });
    if (!address) {
      throw new NotFoundException('Address not found');
    }

    // Check stock availability
    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        throw new BadRequestException(`Insufficient stock for product ${item.product.name}`);
      }
    }

    // Calculate total
    let total = 0;
    const currency = cart.items[0].product.currency;

    for (const item of cart.items) {
      total += item.product.price * item.quantity;
    }

    // Create order (status: PENDING)
    const order = await this.prisma.order.create({
      data: {
        userId,
        total,
        currency,
        status: 'PENDING',
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    // Payment initiation
    if (currency === 'INR') {
      const razorpayOrder = await this.razorpay.orders.create({
        amount: Math.round(total * 100),
        currency: 'INR',
        receipt: order.id,
      });

      await this.prisma.order.update({
        where: { id: order.id },
        data: { razorpayOrderId: razorpayOrder.id },
      });

      return {
        paymentGateway: 'razorpay',
        orderId: order.id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      };
    } else {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(total * 100),
        currency,
        metadata: {
          orderId: order.id,
          userId,
        },
      });

      await this.prisma.order.update({
        where: { id: order.id },
        data: { stripePaymentId: paymentIntent.id },
      });

      return {
        paymentGateway: 'stripe',
        orderId: order.id,
        clientSecret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      };
    }
  }
}
