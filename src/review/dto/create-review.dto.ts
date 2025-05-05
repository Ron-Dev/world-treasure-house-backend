import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min, Max, Length } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty()
  @IsString()
  @Length(10, 500)
  comment: string;

  @ApiProperty()
  @IsString()
  productId: string;
}
