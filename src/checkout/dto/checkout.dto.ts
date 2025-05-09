import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckoutDto {
  @ApiProperty({ description: 'Address ID where order should be delivered' })
  @IsString()
  @IsUUID()
  addressId: string;

  @ApiProperty({ description: 'Optional coupon code', required: false })
  @IsOptional()
  @IsString()
  couponCode?: string;
}
