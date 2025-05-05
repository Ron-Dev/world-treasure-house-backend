// src/order-item/order-item.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { CreateOrderItemDto } from './dto/create-order-item.dto';

@Injectable()
export class OrderItemService {
  constructor(private prisma: PrismaService) {}

  // Create an order item
  async create(createOrderItemDto: CreateOrderItemDto, orderId: string) {
    return this.prisma.orderItem.create({
      data: {
        ...createOrderItemDto,
        orderId,
      },
    });
  }

  // Get all order items for an order
  async findAllByOrder(orderId: string) {
    return this.prisma.orderItem.findMany({
      where: {
        orderId,
      },
    });
  }

  // Get order item by ID
  async findOne(id: string) {
    const orderItem = await this.prisma.orderItem.findUnique({
      where: { id },
    });

    if (!orderItem) {
      throw new NotFoundException(`OrderItem with ID ${id} not found`);
    }

    return orderItem;
  }

  // Update order item by ID
  async update(id: string, updateOrderItemDto: UpdateOrderItemDto) {
    const orderItem = await this.prisma.orderItem.findUnique({
      where: { id },
    });

    if (!orderItem) {
      throw new NotFoundException(`OrderItem with ID ${id} not found`);
    }

    return this.prisma.orderItem.update({
      where: { id },
      data: updateOrderItemDto,
    });
  }

  // Delete order item by ID
  async remove(id: string) {
    const orderItem = await this.prisma.orderItem.findUnique({
      where: { id },
    });

    if (!orderItem) {
      throw new NotFoundException(`OrderItem with ID ${id} not found`);
    }

    return this.prisma.orderItem.delete({
      where: { id },
    });
  }
}
