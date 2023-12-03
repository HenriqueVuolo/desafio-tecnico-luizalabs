import {Order as PrismaOrder} from '@prisma/client';
import {Order, OrderData} from '@domain/entities/order.entity';
import {formatDate} from '@helpers/index';

export class PrismaOrderMapper {
  static toPrisma(order: OrderData): PrismaOrder {
    const {order_id, user_id, date, total, products} = new Order(order);

    return {
      id: order_id,
      userId: user_id,
      products,
      total,
      createdAt: date ? new Date(date) : undefined,
    };
  }

  static toDomain(order: PrismaOrder): Order {
    return new Order({
      order_id: order.id,
      user_id: order.userId,
      date: formatDate(order.createdAt),
      products: order.products as {product_id: number; value: number}[],
    });
  }
}
