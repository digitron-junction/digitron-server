import { Module } from '@nestjs/common';
import { OrderModule } from '../order/order.module';
import { ProductModule } from '../product/product.module';
import { ReviewModule } from '../review/review.module';
import { StoreController } from './store.controller';

@Module({
  imports: [ProductModule, OrderModule, ReviewModule],
  controllers: [StoreController],
})
export class StoreModule {}
