import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { requiredUserHeader } from '~/config/constants';
import { RequiredStoreUserGuard } from '~/guard/required-store-user.guard';
import { RequiredUserGuard } from '~/guard/required-user.guard';
import { RequiredStoreUserRequest, RequiredUserRequest } from '~/types/request';
import {
  ChangeOrderStatusBodyDto,
  ChangeOrderStatusParamsDto,
  CreateOrderDto,
  orderToDto,
} from './order.dto';
import { OrderService } from './order.service';

@ApiTags('Orders')
@Controller('/api/v1/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(RequiredUserGuard)
  @ApiHeader(requiredUserHeader)
  @Post()
  async createOrder(
    @Body() dto: CreateOrderDto,
    @Req() req: RequiredUserRequest,
  ) {
    const order = await this.orderService.createOrder(dto, req.user.id);

    return {
      data: {
        order: orderToDto(order),
      },
    };
  }

  @UseGuards(RequiredStoreUserGuard)
  @ApiHeader(requiredUserHeader)
  @Put('/:orderId')
  async changeOrderStatus(
    @Param() { orderId }: ChangeOrderStatusParamsDto,
    @Body() dto: ChangeOrderStatusBodyDto,
    @Req() req: RequiredStoreUserRequest,
  ) {
    const order = await this.orderService.changeOrderStatus(
      { ...dto, orderId },
      req.user.store.id,
    );

    return {
      data: {
        order: orderToDto(order),
      },
    };
  }
}
