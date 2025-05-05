import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateCouponDto {
  @ApiProperty({ example: 'SUMMER50' })
  @IsString()
  code: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  discount: number;

  @ApiProperty({ example: '2025-12-31' })
  @IsDateString()
  validTill: Date;

  @ApiProperty({ example: 200 })
  @IsNumber()
  minAmount: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  maxDiscount: number;
}
