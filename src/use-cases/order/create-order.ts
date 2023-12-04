import {Order} from '@domain/entities/order.entity';
import {Injectable} from '@nestjs/common';
import {OrderRepository} from '@domain/repositories/order.repository';

type CreateOrderRequest = {
  order_id: number;
  user_id: number;
  products: {product_id: number; value: number}[];
  date: string;
};

@Injectable()
export class CreateOrder {
  constructor(private orderRepository: OrderRepository) {}

  async execute(order: CreateOrderRequest): Promise<Order> {
    return await this.orderRepository.create(order);
  }
}
