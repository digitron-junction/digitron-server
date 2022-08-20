import { Injectable } from '@nestjs/common';
import { ProductNotExistsException } from '~/exception/service-exception/product.exception';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  async createOrder(dto: CreateOrderDto, customerId: number) {
    const product = await this.prismaService.product.findFirst({
      where: { id: dto.productId },
    });
    if (!product) {
      throw new ProductNotExistsException();
    }

    const order = await this.prismaService.order.create({
      data: {
        productId: dto.productId,
        customerId,
        quantity: dto.quantity,
        isPaid: false,
        isDeliveried: false,
        bill: product.price * dto.quantity,
      },
      include: {
        product: true,
      },
    });

    return order;
  }
}
