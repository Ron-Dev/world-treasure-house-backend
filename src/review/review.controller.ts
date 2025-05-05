import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { ReviewService } from './review.service';

import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // Create a new review
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new review (CUSTOMER or ADMIN only)' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@GetCurrentUser('sub') userId: string, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(userId, createReviewDto);
  }

  // Get all reviews for a product
  @Get('product/:productId')
  @ApiOperation({ summary: 'Get all reviews for a product (public)' })
  @ApiResponse({ status: 200, description: 'List of reviews for product' })
  findAllByProduct(@Param('productId') productId: string) {
    return this.reviewService.findAllByProduct(productId);
  }

  // Get review by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get review by ID (public)' })
  @ApiResponse({ status: 200, description: 'Review found by ID' })
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  // Update review by ID
  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER, Role.ADMIN)
  @ApiOperation({ summary: 'Update review by ID (CUSTOMER or ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(
    @GetCurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.update(userId, id, updateReviewDto);
  }

  // Delete review by ID
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER, Role.ADMIN)
  @ApiOperation({ summary: 'Delete review by ID (CUSTOMER or ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  remove(@GetCurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.reviewService.remove(userId, id);
  }
}
