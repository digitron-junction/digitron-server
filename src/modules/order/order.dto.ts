import { ApiProperty } from '@nestjs/swagger';
import { order, product } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { z } from 'zod';

export class CreateOrderDto {
  @ApiProperty({
    required: true,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  productId!: number;

  @ApiProperty({
    required: true,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  quantity!: number;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  ipfsImageHash!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  recevierAddress!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  senderAddress!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  blockAddress!: string;
}

const orderZodSchema = z.object({
  id: z.number(),
  productId: z.number(),
  customerId: z.number(),
  quantity: z.number(),
  isPaid: z.boolean(),
  isDeliveried: z.boolean(),
  bill: z.number(),
  product: z.object({
    id: z.number(),
    name: z.string(),
    category: z.string(),
    subCategory: z.string(),
    price: z.number(),
    originalPrice: z.number(),
    descrption: z.string(),
  }),
});

export const orderToDto = (order: order & { product: product }) => {
  return orderZodSchema.parse(order);
};

export class ChangeOrderStatusParamsDto {
  @ApiProperty({
    type: Number,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  orderId!: number;
}

export class ChangeOrderStatusBodyDto {
  @ApiProperty({
    required: true,
    type: Boolean,
  })
  @Type(() => Boolean)
  @IsBoolean()
  isPaid!: boolean;

  @ApiProperty({
    required: true,
    type: Boolean,
  })
  @Type(() => Boolean)
  @IsBoolean()
  isDeliveried!: boolean;
}
