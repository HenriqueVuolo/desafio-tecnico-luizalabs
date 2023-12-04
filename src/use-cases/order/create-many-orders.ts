import {Injectable} from '@nestjs/common';
import {OrderRepository} from '@domain/repositories/order.repository';

type CreateManyOrdersRequest = {
  order_id: number;
  user_id: number;
  products: {product_id: number; value: number}[];
  date: string;
}[];

@Injectable()
export class CreateManyOrders {
  constructor(private orderRepository: OrderRepository) {}

  async execute(orders: CreateManyOrdersRequest): Promise<void> {
    await Promise.allSettled(
      orders.map(async (order) => await this.orderRepository.create(order)),
    );
  }
}
