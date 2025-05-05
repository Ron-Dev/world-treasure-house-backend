// src/address/address.controller.ts
import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { AddressService } from './address.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@ApiBearerAuth()
@ApiTags('Addresses')
@Controller('addresses')
@UseGuards(JwtAuthGuard) // Apply JWT Auth Guard to all routes
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new address' })
  @ApiResponse({ status: 201, description: 'Address created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(
    @GetCurrentUser('sub') userId: string, // Retrieve userId from JWT
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.addressService.create(userId, createAddressDto); // Pass userId along with address data
  }

  @Get()
  @ApiOperation({ summary: 'Get all addresses of current user' })
  @ApiResponse({ status: 200, description: 'List of all addresses' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll(@GetCurrentUser('sub') userId: string) {
    return this.addressService.findAll(userId); // Retrieve all addresses associated with the userId
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get address by ID' })
  @ApiResponse({ status: 200, description: 'Address found by ID' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id); // Retrieve address by ID
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update address by ID' })
  @ApiResponse({ status: 200, description: 'Address updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(id, updateAddressDto); // Update address with provided data
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete address by ID' })
  @ApiResponse({ status: 200, description: 'Address deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  remove(@Param('id') id: string) {
    return this.addressService.remove(id); // Delete address by ID
  }
}
