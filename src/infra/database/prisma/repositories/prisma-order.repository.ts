import {BadRequestException, Injectable} from '@nestjs/common';
import {OrderRepository} from '@domain/repositories/order.repository';
import {PrismaService} from '../prisma.service';
import {Order, OrderData} from '@domain/entities/order.entity';
import {PrismaOrderMapper} from '../mappers/prisma-order.mappers';

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: OrderData): Promise<Order> {
    const {order_id} = data;
    const orderAlreadyExists = order_id
      ? !!(await this.prisma.order.findFirst({
          where: {
            id: order_id,
          },
        }))
      : false;

    if (orderAlreadyExists)
      throw new BadRequestException('Pedido já está cadastrado');

    try {
      const order = await this.prisma.order.create({
        data: PrismaOrderMapper.toPrisma(data),
      });

      if (order && !!data.order_id) {
        await this.syncOrderTableIndex();
      }

      return PrismaOrderMapper.toDomain(order);
    } catch (error) {
      throw new BadRequestException('Ocorreu um erro ao cadastrar usuário');
    }
  }

  async findMany(params: {
    user_id?: Order['user_id'];
    from?: string;
    to?: string;
    take?: number;
    skip?: number;
    order?: 'asc' | 'desc';
  }): Promise<Order[]> {
    const {user_id, from, to, take, skip, order} = params;
    const orders = await this.prisma.order.findMany({
      where: {
        ...(user_id && {userId: user_id}),
        ...((from || to) && {
          createdAt: {
            ...(from && {
              gt: from ? new Date(from) : null,
            }),
            ...(to && {
              lt: to ? new Date(to) : null,
            }),
          },
        }),
      },
      take,
      skip,
      orderBy: {
        createdAt: order || 'desc',
      },
    });
    return orders.map((order) => PrismaOrderMapper.toDomain(order));
  }

  async findOne(order_id: number): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {id: order_id},
    });

    if (!order) return null;

    return PrismaOrderMapper.toDomain(order);
  }

  /*
    Método responsável por atualizar o index da tabela de pedidos. Quando salvamos
    um registro enviando o order_id o postgres "se perde" na contagem do index autoincrement.
  */
  private async syncOrderTableIndex() {
    await this.prisma.$queryRaw`
      SELECT setval(pg_get_serial_sequence('orders', 'id'), coalesce(max(id)+1, 1), false) FROM orders
    `;
  }
}
