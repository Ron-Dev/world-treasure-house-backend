import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async getWishlist(userId: string) {
    return await this.prisma.wishlist.findUnique({
      where: { userId },
      include: {
        products: true,
      },
    });
  }

  async addToWishlist(userId: string, dto: AddToWishlistDto) {
    const wishlist = await this.prisma.wishlist.upsert({
      where: { userId },
      update: {
        products: {
          connect: dto.productIds.map((id) => ({ id })),
        },
      },
      create: {
        userId,
        products: {
          connect: dto.productIds.map((id) => ({ id })),
        },
      },
      include: {
        products: true,
      },
    });

    return wishlist;
  }

  async removeFromWishlist(userId: string, productId: string) {
    const wishlist = await this.prisma.wishlist.findUnique({
      where: { userId },
      include: { products: true },
    });

    if (!wishlist) throw new NotFoundException('Wishlist not found');

    return await this.prisma.wishlist.update({
      where: { userId },
      data: {
        products: {
          disconnect: { id: productId },
        },
      },
      include: {
        products: true,
      },
    });
  }
}
