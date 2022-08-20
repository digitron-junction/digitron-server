import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CloudflareService } from '../cloudflare/cloudflare.service';
import { productEntityToDto } from '../product/product.dto';
import { ProductService } from '../product/product.service';
import { GetStoreProductsDto } from './store.dto';

@ApiTags('Store')
@Controller('/api/v1/stores')
export class StoreController {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudflareService: CloudflareService,
  ) {}

  @ApiOperation({
    summary: 'get all products by storeId',
  })
  @Get('/:storeId/products')
  async getStoreProducts(@Param() { storeId }: GetStoreProductsDto) {
    const products = await this.productService.getProductsByStoreId(storeId);

    return {
      data: {
        products: await Promise.all(
          products.map(async (product) => {
            return await productEntityToDto(product, {
              cloudflareService: this.cloudflareService,
            });
          }),
        ),
      },
    };
  }
}
