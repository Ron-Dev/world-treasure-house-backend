import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { Role } from '@prisma/client';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';

@ApiTags('Wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER, Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Add products to wishlist' })
  @ApiResponse({ status: 201, description: 'Products added to wishlist' })
  addToWishlist(@GetCurrentUser('sub') userId: string, @Body() dto: AddToWishlistDto) {
    return this.wishlistService.addToWishlist(userId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER, Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get your wishlist' })
  @ApiResponse({ status: 200, description: 'Wishlist fetched' })
  getWishlist(@GetCurrentUser('sub') userId: string) {
    return this.wishlistService.getWishlist(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER, Role.ADMIN)
  @Delete(':productId')
  @ApiOperation({ summary: 'Remove a product from wishlist' })
  @ApiResponse({ status: 200, description: 'Product removed from wishlist' })
  removeFromWishlist(@GetCurrentUser('sub') userId: string, @Param('productId') productId: string) {
    return this.wishlistService.removeFromWishlist(userId, productId);
  }
}
