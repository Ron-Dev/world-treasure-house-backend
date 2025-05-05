// src/order-item/dto/update-order-item.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderItemDto {
  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;
}
