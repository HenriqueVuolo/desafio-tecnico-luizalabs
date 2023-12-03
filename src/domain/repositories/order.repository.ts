import {Order, OrderData} from '../entities/order.entity';

export abstract class OrderRepository {
  abstract create: (data: OrderData) => Promise<Order>;
  abstract findMany: (params: {
    user_id?: Order['user_id'];
    from?: string;
    to?: string;
    take?: number;
    skip?: number;
    order?: 'asc' | 'desc';
  }) => Promise<Order[]>;
  abstract findOne: (user_id: Order['order_id']) => Promise<Order | null>;
}
