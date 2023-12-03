import {User} from '../entities/user.entity';

export abstract class UserRepository {
  abstract create: (data: User) => Promise<User>;
  abstract createMany: (data: User[]) => Promise<void>;
  abstract findMany: (params: {
    take?: number;
    skip?: number;
    order?: 'asc' | 'desc';
  }) => Promise<User[]>;
  abstract findOne: (user_id: User['user_id']) => Promise<User | null>;
}
