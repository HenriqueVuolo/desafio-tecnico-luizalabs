import {Injectable, NotFoundException} from '@nestjs/common';
import {Order} from '@domain/entities/order.entity';
import {OrderRepository} from '@domain/repositories/order.repository';

@Injectable()
export class FindOrder {
  constructor(private orderRepository: OrderRepository) {}

  async execute(order_id: number): Promise<Order> {
    const order = await this.orderRepository.findOne(order_id);

    if (!order) throw new NotFoundException('Pedido não encontrado.');

    return order;
  }
}
