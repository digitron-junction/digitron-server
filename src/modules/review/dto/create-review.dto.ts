import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  content!: string;

  @ApiProperty({
    required: true,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  productId!: number;

  @Min(1)
  @Max(5)
  @ApiProperty({
    required: true,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  rating!: number;
}
