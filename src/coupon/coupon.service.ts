import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateCouponDto) {
    return this.prisma.coupon.create({
      data: {
        ...dto,
      },
    });
  }

  async findAll() {
    return this.prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }

  async update(userId: string, id: string, dto: UpdateCouponDto) {
    return this.prisma.coupon.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    return this.prisma.coupon.delete({
      where: { id },
    });
  }

  async validateCoupon(code: string, orderAmount: number) {
    const coupon = await this.prisma.coupon.findUnique({ where: { code } });
    if (!coupon) throw new NotFoundException('Invalid coupon code');

    const now = new Date();
    if (coupon.validTill < now) throw new NotFoundException('Coupon expired');

    if (orderAmount < coupon.minAmount)
      throw new NotFoundException('Minimum amount not met for this coupon');

    const discountValue = (coupon.discount / 100) * orderAmount;
    const finalDiscount = Math.min(discountValue, coupon.maxDiscount);

    return {
      discount: finalDiscount,
      message: `Coupon applied. You saved ₹${finalDiscount.toFixed(2)}`,
    };
  }
}
