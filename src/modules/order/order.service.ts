import { Injectable } from '@nestjs/common';
import {
  NoPermissionToUpdateOrderException,
  OrderNotfoundException,
} from '~/exception/service-exception/order.exception';
import { ProductNotExistsException } from '~/exception/service-exception/product.exception';
import { PrismaService } from '../prisma/prisma.service';
import { ChangeOrderStatusBodyDto, CreateOrderDto } from './order.dto';

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

  async changeOrderStatus(
    dto: ChangeOrderStatusBodyDto & { orderId: number },
    userStoreId: number,
  ) {
    const order = await this.prismaService.order.findFirst({
      where: {
        id: dto.orderId,
        deletedAt: null,
      },
      include: {
        product: true,
      },
    });

    if (order === null) {
      throw new OrderNotfoundException();
    }

    if (order.product.storeId !== userStoreId) {
      throw new NoPermissionToUpdateOrderException();
    }

    const chagnedOrder = await this.prismaService.order.update({
      where: {
        id: dto.orderId,
      },
      data: {
        isDeliveried: dto.isDeliveried,
        isPaid: dto.isPaid,
      },
      include: {
        product: true,
      },
    });

    return chagnedOrder;
  }
}
