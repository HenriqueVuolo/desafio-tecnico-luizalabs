import {User as PrismaUser, Order as PrismaOrder} from '@prisma/client';
import {User} from '@domain/entities/user.entity';
import {PrismaOrderMapper} from './prisma-order.mappers';

export class PrismaUserMapper {
  static toPrisma(user: User): PrismaUser {
    const {user_id, name} = new User(user);
    return {
      id: user_id,
      name,
    };
  }
  static toDomain(user: PrismaUser): User {
    return new User({
      user_id: user.id,
      name: user.name,
    });
  }
  static withOrderToDomain(user: PrismaUser & {orders: PrismaOrder[]}): User {
    return new User({
      user_id: user.id,
      name: user.name,
      orders: user.orders?.map((order) => PrismaOrderMapper.toDomain(order)),
    });
  }
}
