import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import {CreateOrder} from '@useCases/order/create-order';
import {FindOrders} from '@useCases/order/find-orders';

import {FindOrder} from '@useCases/order/find-order';
import {CreateOrderDto} from '../dtos/orders/create-order.dto';
import {FindOrdersDto} from '../dtos/orders/find-orders.dto';
import {FindOrderDto} from '../dtos/orders/find-order.dto';
import {Order} from '@domain/entities/order.entity';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private findOrders: FindOrders,
    private findOrder: FindOrder,
    private createOrder: CreateOrder,
  ) {}

  @Get()
  @ApiOperation({summary: 'Get all orders'})
  async findAll(@Query() params: FindOrdersDto) {
    return await this.findOrders.execute(params);
  }

  @Get(':order_id')
  @ApiOperation({summary: 'Get order by id'})
  @ApiResponse({
    status: 200,
    type: Order,
  })
  @ApiNotFoundResponse({
    status: 404,
  })
  async findById(@Param() {order_id}: FindOrderDto) {
    return await this.findOrder.execute(order_id);
  }

  @Post()
  @ApiOperation({summary: 'Create order'})
  @ApiResponse({
    status: 200,
    type: Order,
  })
  async create(@Body() payload: CreateOrderDto): Promise<Order> {
    return await this.createOrder.execute(payload);
  }
}
