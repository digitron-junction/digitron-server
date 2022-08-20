import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetStoreProductsDto {
  @ApiProperty({
    description: 'store Id',
    required: true,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  storeId!: number;
}

export class GetStoreOrdersDto {
  @ApiProperty({
    description: 'store Id',
    required: true,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  storeId!: number;
}
