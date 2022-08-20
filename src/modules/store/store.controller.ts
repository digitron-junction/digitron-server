import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CloudflareService } from '../cloudflare/cloudflare.service';
import { FollowService } from '../follow/follow.service';
import { orderToDto } from '../order/order.dto';
import { OrderService } from '../order/order.service';
import { productEntityToDto } from '../product/product.dto';
import { ProductService } from '../product/product.service';
import { ReviewService } from '../review/review.service';
import {
  GetFollowerAndConsumerCountDto,
  GetStoreOrdersDto,
  GetStoreProductsDto,
} from './store.dto';

@ApiTags('Store')
@Controller('/api/v1/stores')
export class StoreController {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudflareService: CloudflareService,
    private readonly orderService: OrderService,
    private readonly reviewService: ReviewService,
    private readonly followService: FollowService,
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
              productService: this.productService,
              reviewService: this.reviewService,
            });
          }),
        ),
      },
    };
  }

  @ApiOperation({
    summary: 'get all order by storeId',
  })
  @Get('/:storeId/orders')
  async get(@Param() { storeId }: GetStoreOrdersDto) {
    const orders = await this.orderService.getOrdersByStoreId(storeId);

    return {
      data: {
        orders: await Promise.all(
          orders.map(async (order) => {
            return orderToDto(order);
          }),
        ),
      },
    };
  }

  @ApiOperation({
    summary: 'get count of follower and consumer',
  })
  @Get('/:storeId/follower_and_consumer_count')
  async getFollowerAndConsumerCount(
    @Param() { storeId }: GetFollowerAndConsumerCountDto,
  ) {
    const [consumerCount, followerCount] = await Promise.all([
      this.orderService.getUniqConsumerCountByStoreId(storeId),
      this.followService.getFollowerCountByStoreId(storeId),
    ]);
    return {
      data: {
        consumerCount,
        followerCount,
      },
    };
  }
}
