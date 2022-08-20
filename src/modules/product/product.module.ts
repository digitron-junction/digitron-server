import { Module } from '@nestjs/common';
import { ReviewModule } from '../review/review.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [ReviewModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
