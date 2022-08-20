import { Injectable } from '@nestjs/common';
import {
  NoPermissionToUpdateOrderException,
  NoStockException,
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

    if (product.stock < dto.quantity) {
      throw new NoStockException();
    }

    const order = await this.prismaService.order.create({
      data: {
        productId: dto.productId,
        customerId,
        quantity: dto.quantity,
        isPaid: false,
        isDeliveried: false,
        bill: product.price * dto.quantity,
        ipfsImageHash: dto.ipfsImageHash,
        recevierAddress: dto.recevierAddress,
        senderAddress: dto.senderAddress,
        blockAddress: dto.blockAddress,
      },
      include: {
        product: true,
      },
    });

    const updatedProduct = await this.prismaService.product.update({
      where: { id: product.id },
      data: {
        stock: { decrement: dto.quantity },
      },
    });

    order.product = updatedProduct;

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

  async getOrdersByStoreId(storeId: number) {
    const orders = await this.prismaService.order.findMany({
      where: {
        product: {
          storeId,
        },
        deletedAt: null,
      },
      orderBy: {
        id: 'desc',
      },
      include: {
        product: true,
      },
    });

    return orders;
  }
}
