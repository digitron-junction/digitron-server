import { Module } from '@nestjs/common';
import { FollowModule } from '../follow/follow.module';
import { OrderModule } from '../order/order.module';
import { ProductModule } from '../product/product.module';
import { ReviewModule } from '../review/review.module';
import { StoreController } from './store.controller';

@Module({
  imports: [ProductModule, OrderModule, ReviewModule, FollowModule],
  controllers: [StoreController],
})
export class StoreModule {}
