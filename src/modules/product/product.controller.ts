import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { requiredUserHeader } from '~/config/constants';
import { RequiredStoreUserGuard } from '~/guard/required-store-user.guard';
import { RequiredStoreUserRequest } from '~/types/request';
import { CloudflareService } from '../cloudflare/cloudflare.service';
import {
  CreateProductDto,
  GetProductDto,
  productEntityToDto,
} from './product.dto';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('/api/v1/products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudflareService: CloudflareService,
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
        }),
      },
    };
  }
}
