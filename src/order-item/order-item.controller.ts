// src/order-item/order-item.controller.ts

import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { OrderItemService } from './order-item.service';

import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { CreateOrderItemDto } from './dto/create-order-item.dto';

@ApiTags('OrderItems')
@Controller('order-items')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post(':orderId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new order item' })
  @ApiResponse({ status: 201, description: 'Order item created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(
    @GetCurrentUser('sub') userId: string,
    @Param('orderId') orderId: string,
    @Body() createOrderItemDto: CreateOrderItemDto,
  ) {
    return this.orderItemService.create(createOrderItemDto, orderId);
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Get all order items for an order' })
  @ApiResponse({ status: 200, description: 'List of all order items' })
  findAllByOrder(@Param('orderId') orderId: string) {
    return this.orderItemService.findAllByOrder(orderId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order item by ID' })
  @ApiResponse({ status: 200, description: 'Order item found by ID' })
  findOne(@Param('id') id: string) {
    return this.orderItemService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER, Role.ADMIN)
  @ApiOperation({ summary: 'Update order item by ID' })
  @ApiResponse({ status: 200, description: 'Order item updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(@Param('id') id: string, @Body() updateOrderItemDto: UpdateOrderItemDto) {
    return this.orderItemService.update(id, updateOrderItemDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER, Role.ADMIN)
  @ApiOperation({ summary: 'Delete order item by ID' })
  @ApiResponse({ status: 200, description: 'Order item deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  remove(@Param('id') id: string) {
    return this.orderItemService.remove(id);
  }
}
