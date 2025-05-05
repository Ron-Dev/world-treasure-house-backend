import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  // Create Review
  async create(userId: string, createReviewDto: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        ...createReviewDto,
        userId: userId,
      },
    });
  }

  // Get all reviews for a product
  async findAllByProduct(productId: string) {
    return this.prisma.review.findMany({
      where: {
        productId,
      },
    });
  }

  // Get review by ID
  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: {
        id,
      },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  // Update review by ID
  async update(userId: string, id: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    if (review.userId !== userId) {
      throw new Error('You cannot update this review.');
    }

    return this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
    });
  }

  // Delete review by ID
  async remove(userId: string, id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    if (review.userId !== userId) {
      throw new Error('You cannot delete this review.');
    }

    return this.prisma.review.delete({
      where: { id },
    });
  }
}
