import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ProductModule } from '../product/product.module';

@Global()
@Module({
  imports: [ProductModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
