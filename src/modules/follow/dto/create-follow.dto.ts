import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class CreateFollowDto {
  @ApiProperty({
    type: Number,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  storeId!: number;
}
