import { Module } from '@nestjs/common';
import { OrderModule } from '../order/order.module';
import { ProductModule } from '../product/product.module';
import { StoreController } from './store.controller';

@Module({
  imports: [ProductModule, OrderModule],
  controllers: [StoreController],
})
export class StoreModule {}
