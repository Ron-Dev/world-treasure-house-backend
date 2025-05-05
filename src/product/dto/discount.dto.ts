import { IsString, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DiscountDTO {
  @ApiProperty()
  @IsNumber()
  discountPct: number;

  @ApiProperty()
  @IsDateString()
  validTill: Date;
}
