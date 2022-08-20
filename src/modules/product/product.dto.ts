import { ApiProperty } from '@nestjs/swagger';
import { product, store } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { z } from 'zod';
import { CloudflareService } from '../cloudflare/cloudflare.service';
import { imageEntityZodSchema } from '../image/image.dto';
import { storeToDto, storeZodSchema } from '../user/user.dto';

export class CreateProductDto {
  @ApiProperty({
    type: String,
    description: 'product name',
    required: true,
  })
  @IsString()
  name!: string;

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'product image ids',
    required: true,
  })
  @IsString({ each: true })
  imageIds: string[] = [];

  @ApiProperty({
    type: String,
    description: 'product category',
    required: true,
  })
  @IsString()
  category!: string;

  @ApiProperty({
    type: String,
    description: 'product subCategory',
    required: true,
  })
  @IsString()
  subCategory!: string;

  @ApiProperty({
    type: Number,
    description: 'product price',
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  price!: number;

  @ApiProperty({
    type: Number,
    description: 'product originalPrice',
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  originalPrice!: number;

  @ApiProperty({
    type: String,
    description: 'product descrption',
    required: true,
  })
  @IsString()
  descrption!: string;
}

const productDtoZodSchema = z.object({
  id: z.number(),
  name: z.string(),
  images: z.array(imageEntityZodSchema),
  category: z.string(),
  subCategory: z.string(),
  price: z.number(),
  originalPrice: z.number(),
  descrption: z.string(),
  store: storeZodSchema,
});

const productImagesZodSchema = z.object({
  ids: z.array(z.string()),
});

export const productEntityToDto = async (
  product: product & { store: store },
  services: { cloudflareService: CloudflareService },
) => {
  const { ids: imageIds } = productImagesZodSchema.parse(product.images);

  return productDtoZodSchema.parse({
    ...product,
    images: await Promise.all(
      imageIds.map(async (imageId) => {
        const image = await services.cloudflareService.getImageDetailById(
          imageId,
        );
        return image;
      }),
    ),
    store: await storeToDto(product.store, services),
  });
};

export class GetProductDto {
  @ApiProperty({
    description: 'product id',
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  productId!: number;
}
