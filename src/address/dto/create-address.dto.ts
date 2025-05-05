// src/address/dto/create-address.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ description: 'Street address' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ description: 'City name' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'State or province name' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ description: 'Country name' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ description: 'Postal code' })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({ description: 'Phone number associated with the address' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Flag to indicate if this is the default address', default: false })
  @IsBoolean()
  @IsOptional()
  isDefault: boolean = false;
}
