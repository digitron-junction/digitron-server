import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { requiredUserHeader } from '~/config/constants';
import { RequiredUserGuard } from '~/guard/required-user.guard';
import { RequiredUserRequest } from '~/types/request';
import { CreateOrderDto, orderToDto } from './order.dto';
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
}
