import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class UpdateReviewDto {
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
  rating!: number;
}
