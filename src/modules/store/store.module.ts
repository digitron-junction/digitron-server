import { Module } from '@nestjs/common';
import { ProductModule } from '../product/product.module';
import { StoreController } from './store.controller';

@Module({
  imports: [ProductModule],
  controllers: [StoreController],
})
export class StoreModule {}
