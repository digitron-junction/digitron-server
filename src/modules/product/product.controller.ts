import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { requiredUserHeader } from '~/config/constants';
import { RequiredStoreUserGuard } from '~/guard/required-store-user.guard';
import { RequiredUserGuard } from '~/guard/required-user.guard';
import { RequiredStoreUserRequest } from '~/types/request';
import { CloudflareService } from '../cloudflare/cloudflare.service';
import { ReviewService } from '../review/review.service';
import {
  ChangeProductStockBodyDto,
  ChangeProductStockParamsDto,
  CreateProductDto,
  DecrLikeDto,
  DeleteProductDto,
  GetProductDto,
  IncrLikeDto,
  productEntityToDto,
} from './product.dto';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('/api/v1/products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudflareService: CloudflareService,
    private readonly reviewService: ReviewService,
  ) {}

  @UseGuards(RequiredStoreUserGuard)
  @ApiHeader(requiredUserHeader)
  @Post()
  async createProduct(
    @Body() dto: CreateProductDto,
    @Req() req: RequiredStoreUserRequest,
  ) {
    const product = await this.productService.createProduct({
      ...dto,
      storeId: req.user.store.id,
    });

    return {
      data: {
        product: await productEntityToDto(product, {
          cloudflareService: this.cloudflareService,
          productService: this.productService,
          reviewService: this.reviewService,
        }),
      },
    };
  }

  @Get('/:productId')
  async getProduct(@Param() { productId }: GetProductDto) {
    const product = await this.productService.getProductById(productId);
    return {
      data: {
        product: await productEntityToDto(product, {
          cloudflareService: this.cloudflareService,
          productService: this.productService,
          reviewService: this.reviewService,
        }),
      },
    };
  }

  @UseGuards(RequiredStoreUserGuard)
  @ApiHeader(requiredUserHeader)
  @Delete('/:productId')
  async deleteProduct(
    @Param() { productId }: DeleteProductDto,
    @Req() req: RequiredStoreUserRequest,
  ) {
    const product = await this.productService.deleteProductById(
      productId,
      req.user.store.id,
    );

    return {
      data: {
        product: await productEntityToDto(product, {
          cloudflareService: this.cloudflareService,
          productService: this.productService,
          reviewService: this.reviewService,
        }),
      },
    };
  }

  @UseGuards(RequiredUserGuard)
  @ApiHeader(requiredUserHeader)
  @Put('/:productId/likes/incr')
  async incrLike(
    @Param() { productId }: IncrLikeDto,
    @Req() req: RequiredStoreUserRequest,
  ) {
    const product = await this.productService.incrProductLike({
      userId: req.user.id,
      productId,
    });

    return {
      data: {
        product: await productEntityToDto(product, {
          cloudflareService: this.cloudflareService,
          productService: this.productService,
          reviewService: this.reviewService,
        }),
      },
    };
  }

  @UseGuards(RequiredUserGuard)
  @ApiHeader(requiredUserHeader)
  @Put('/:productId/likes/decr')
  async decrLike(
    @Param() { productId }: DecrLikeDto,
    @Req() req: RequiredStoreUserRequest,
  ) {
    const product = await this.productService.decrProductLike({
      userId: req.user.id,
      productId,
    });

    return {
      data: {
        product: await productEntityToDto(product, {
          cloudflareService: this.cloudflareService,
          productService: this.productService,
          reviewService: this.reviewService,
        }),
      },
    };
  }

  @UseGuards(RequiredStoreUserGuard)
  @ApiHeader(requiredUserHeader)
  @Put('/:productId/change_stock')
  async changeProductStock(
    @Param() { productId }: ChangeProductStockParamsDto,
    @Body() { stock }: ChangeProductStockBodyDto,
  ) {
    const product = await this.productService.changeProductStock({
      productId,
      stockCount: stock,
    });

    return {
      data: {
        product: await productEntityToDto(product, {
          cloudflareService: this.cloudflareService,
          productService: this.productService,
          reviewService: this.reviewService,
        }),
      },
    };
  }
}
