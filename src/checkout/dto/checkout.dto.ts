import { IsString, IsOptional, IsUUID, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckoutDto {
  @ApiProperty({ description: 'Address ID where order should be delivered' })
  @IsString()
  @IsUUID()
  addressId: string;

  @ApiProperty({ enum: ['razorpay', 'stripe'], required: false })
  @IsOptional()
  @IsIn(['razorpay', 'stripe'])
  preferredGateway?: 'razorpay' | 'stripe'; // for future use
}
