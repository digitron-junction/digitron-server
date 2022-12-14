import { ApiProperty } from '@nestjs/swagger';
import { product, store } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import * as _ from 'lodash';
import { z } from 'zod';
import { CloudflareService } from '../cloudflare/cloudflare.service';
import { imageEntityZodSchema } from '../image/image.dto';
import { reviewZodSchema } from '../review/dto/review.dto';
import { ReviewService } from '../review/review.service';
import { storeToDto, storeZodSchema } from '../user/user.dto';
import { ProductService } from './product.service';

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

  @ApiProperty({
    type: Number,
    description: 'product stock',
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  stock!: number;
}

export const productDtoZodSchema = z.object({
  id: z.number(),
  name: z.string(),
  images: z.array(imageEntityZodSchema),
  category: z.string(),
  subCategory: z.string(),
  price: z.number(),
  originalPrice: z.number(),
  descrption: z.string(),
  store: storeZodSchema,
  stock: z.number(),
  likeCount: z.number(),
  rating: z.number(),
  nonBuyerReview: z.array(reviewZodSchema),
  buyReview: z.array(reviewZodSchema),
});

const productImagesZodSchema = z.object({
  ids: z.array(z.string()),
});

export const productEntityToDto = async (
  product: product & { store: store },
  services: {
    cloudflareService: CloudflareService;
    productService: ProductService;
    reviewService: ReviewService;
  },
) => {
  const { ids: imageIds } = productImagesZodSchema.parse(product.images);

  const reviews = await services.reviewService.findReviewsWithBuyerCondition(
    product.id,
  );

  const allReviews = [...reviews.buyerReviews, ...reviews.nonBuyerReviews];

  const rating =
    allReviews.length > 0
      ? _.mean(allReviews.map((review) => review.rating))
      : 0;

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
    likeCount: await services.productService.getLikeCountByProductId(
      product.id,
    ),
    nonBuyerReview: reviews.nonBuyerReviews,
    buyReview: reviews.buyerReviews,
    rating,
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

export class DeleteProductDto {
  @ApiProperty({
    description: 'product id',
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  productId!: number;
}

export class IncrLikeDto {
  @ApiProperty({
    description: 'product id',
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  productId!: number;
}

export class DecrLikeDto {
  @ApiProperty({
    description: 'product id',
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  productId!: number;
}

export class ChangeProductStockParamsDto {
  @ApiProperty({
    description: 'product id',
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  productId!: number;
}

export class ChangeProductStockBodyDto {
  @ApiProperty({
    description: 'stock',
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  stock!: number;
}
