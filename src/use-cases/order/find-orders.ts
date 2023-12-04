import {Injectable} from '@nestjs/common';
import {Order} from '@domain/entities/order.entity';
import {OrderRepository} from '@domain/repositories/order.repository';

@Injectable()
export class FindOrders {
  constructor(private orderRepository: OrderRepository) {}

  async execute(params: {
    user_id?: number;
    from?: string;
    to?: string;
    take?: number;
    skip?: number;
    order?: 'asc' | 'desc';
  }): Promise<Order[]> {
    return await this.orderRepository.findMany(params);
  }
}
