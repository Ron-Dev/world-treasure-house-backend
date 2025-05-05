import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new coupon (ADMIN only)' })
  @ApiResponse({ status: 201, description: 'Coupon created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@GetCurrentUser('sub') userId: string, @Body() dto: CreateCouponDto) {
    return this.couponService.create(userId, dto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all coupons (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'List of all coupons' })
  findAll() {
    return this.couponService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get coupon by ID (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Coupon found by ID' })
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update coupon by ID (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Coupon updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(
    @GetCurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCouponDto,
  ) {
    return this.couponService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete coupon by ID (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Coupon deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  remove(@GetCurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.couponService.remove(userId, id);
  }

  @Get('/validate/code')
  @ApiOperation({ summary: 'Validate a coupon code (public)' })
  @ApiResponse({ status: 200, description: 'Coupon validated successfully' })
  validate(@Query('code') code: string, @Query('orderAmount') orderAmount: number) {
    return this.couponService.validateCoupon(code, orderAmount);
  }
}
