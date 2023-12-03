import {Module} from '@nestjs/common';
import {PrismaService} from './prisma/prisma.service';
import {UserRepository} from '@domain/repositories/user.repository';
import {PrismaUserRepository} from './prisma/repositories/prisma-user.repository';
import {OrderRepository} from '@domain/repositories/order.repository';
import {PrismaOrderRepository} from './prisma/repositories/prisma-order.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: OrderRepository,
      useClass: PrismaOrderRepository,
    },
  ],
  exports: [UserRepository, OrderRepository],
})
export class DatabaseModule {}
