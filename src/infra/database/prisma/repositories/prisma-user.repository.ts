import {BadRequestException, Injectable, Logger} from '@nestjs/common';
import {UserRepository} from '@domain/repositories/user.repository';
import {PrismaService} from '../prisma.service';
import {User} from '@domain/entities/user.entity';
import {PrismaUserMapper} from '../mappers/prisma-user.mappers';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  private logger = new Logger(PrismaUserRepository.name);
  constructor(private prisma: PrismaService) {}

  async create(data: User): Promise<User> {
    const {user_id} = data;
    const userAlreadyExists = user_id
      ? !!(await this.prisma.user.findFirst({
          where: {id: user_id},
        }))
      : false;

    if (userAlreadyExists)
      throw new BadRequestException('Usuário já está cadastrado');

    try {
      const user = await this.prisma.user.create({
        data: PrismaUserMapper.toPrisma(data),
      });

      if (user && !!user.id) {
        await this.syncUserTableIndex();
      }

      return PrismaUserMapper.toDomain(user);
    } catch {
      throw new BadRequestException('Ocorreu um erro ao cadastrar usuário');
    }
  }

  async createMany(data: User[]): Promise<void> {
    const newUsers: User[] = [];

    await Promise.allSettled(
      data.map(async (user) => {
        const {user_id} = user;
        const userAlreadyExists = user_id
          ? !!(await this.prisma.user.findFirst({
              where: {id: user_id},
            }))
          : false;
        if (userAlreadyExists) {
          this.logger.warn(`Already exist an user with this id: ${user_id}`);
        } else {
          newUsers.push(user);
        }
      }),
    );

    try {
      await this.prisma.user.createMany({
        data: newUsers.map((user) => PrismaUserMapper.toPrisma(user)),
      });
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new BadRequestException('Ocorreu um erro ao cadastrar usuários');
    }

    if (!!data.at(-1).user_id) {
      await this.syncUserTableIndex();
    }
  }

  async findMany(params: {
    take?: number;
    skip?: number;
    order?: 'asc' | 'desc';
  }): Promise<User[]> {
    const {take, skip, order} = params;
    const users = await this.prisma.user.findMany({
      take,
      skip,
      orderBy: {id: order || 'desc'},
      include: {orders: {orderBy: {createdAt: 'desc'}}},
    });
    return users.map((user) => PrismaUserMapper.withOrderToDomain(user));
  }

  async findOne(user_id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {id: user_id},
      include: {
        orders: true,
      },
    });

    if (!user) return null;

    return PrismaUserMapper.withOrderToDomain(user);
  }

  /*
    Método responsável por atualizar o index da tabela de usuários. Quando salvamos
    um registro enviando o user_id o postgres "se perde" na contagem do index autoincrement.
  */
  private async syncUserTableIndex() {
    this.logger.log('Synchronizing order table index');
    await this.prisma.$queryRaw`
      SELECT setval(pg_get_serial_sequence('users', 'id'), coalesce(max(id)+1, 1), false) FROM users
    `;
  }
}
