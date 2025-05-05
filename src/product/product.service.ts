import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { slugify } from '../utils/slugify';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(name: string): string {
    return slugify(name);
  }

  async create(userId: string, dto: CreateProductDto) {
    const slug = this.generateSlug(dto.name);

    return await this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name: dto.name,
          description: dto.description,
          price: dto.price,
          currency: dto.currency,
          stock: dto.stock,
          images: dto.images,
          slug,
          categoryId: dto.categoryId,
          sellerId: userId,
        },
      });

      if (dto.regionPrices?.length) {
        await tx.regionPrice.createMany({
          data: dto.regionPrices.map((rp) => ({
            productId: product.id,
            region: rp.region,
            price: rp.price,
            currency: rp.currency,
          })),
        });
      }

      if (dto.discount) {
        await tx.productDiscount.create({
          data: {
            productId: product.id,
            discountPct: dto.discount.discountPct,
            validTill: new Date(dto.discount.validTill),
          },
        });
      }

      return product;
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
        reviews: true,
        regionPrices: true,
        discount: true,
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: true,
        regionPrices: true,
        discount: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(userId: string, id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) throw new NotFoundException('Product not found');
    if (product.sellerId !== userId) throw new ForbiddenException('Unauthorized');

    const slug = this.generateSlug(dto.name || product.name);

    return await this.prisma.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          name: dto.name ?? product.name,
          description: dto.description ?? product.description,
          price: dto.price ?? product.price,
          currency: dto.currency ?? product.currency,
          stock: dto.stock ?? product.stock,
          categoryId: dto.categoryId ?? product.categoryId, // Ensure this is handled correctly
          images: dto.images ?? product.images,
          slug,
        },
      });

      if (dto.regionPrices) {
        await tx.regionPrice.deleteMany({ where: { productId: id } });
        await tx.regionPrice.createMany({
          data: dto.regionPrices.map((rp) => ({
            productId: id,
            region: rp.region,
            price: rp.price,
            currency: rp.currency,
          })),
        });
      }

      if (dto.discount) {
        await tx.productDiscount.upsert({
          where: { productId: id },
          create: {
            productId: id,
            discountPct: dto.discount.discountPct,
            validTill: new Date(dto.discount.validTill),
          },
          update: {
            discountPct: dto.discount.discountPct,
            validTill: new Date(dto.discount.validTill),
          },
        });
      }

      return updatedProduct;
    });
  }

  async remove(userId: string, id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.sellerId !== userId) throw new ForbiddenException('Unauthorized');

    return await this.prisma.product.delete({ where: { id } });
  }
}
