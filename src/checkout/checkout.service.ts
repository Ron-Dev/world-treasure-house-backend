// checkout.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CheckoutDto } from './dto/checkout.dto';

@Injectable()
export class CheckoutService {
  constructor(private readonly prisma: PrismaService) {}

  async checkout(userId: string, dto: CheckoutDto) {
    // 1. Get user's cart with items
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Your cart is empty.');
    }

    // 2. Verify address belongs to user
    const address = await this.prisma.address.findFirst({
      where: {
        id: dto.addressId,
        userId,
      },
    });

    if (!address) {
      throw new NotFoundException('Address not found.');
    }

    // 3. Check stock for each item
    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        throw new BadRequestException(`Insufficient stock for product: ${item.product.name}`);
      }
    }

    // 4. Calculate total
    let total = 0;
    for (const item of cart.items) {
      total += item.product.price * item.quantity;
    }

    // 5. Create Order with nested OrderItems
    const order = await this.prisma.order.create({
      data: {
        userId,
        total,
        currency: cart.items[0].product.currency,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // 6. Update product stock
    const stockUpdates = cart.items.map((item) =>
      this.prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      }),
    );
    await this.prisma.$transaction(stockUpdates);

    // 7. Clear the cart
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return {
      message: 'Order placed successfully.',
      orderId: order.id,
      total,
    };
  }
}
