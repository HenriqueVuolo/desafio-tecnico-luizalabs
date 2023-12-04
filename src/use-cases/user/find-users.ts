import {Injectable} from '@nestjs/common';
import {User} from '@domain/entities/user.entity';
import {UserRepository} from '@domain/repositories/user.repository';

@Injectable()
export class FindUsers {
  constructor(private userRepository: UserRepository) {}

  async execute(params: {
    take?: number;
    skip?: number;
    order?: 'asc' | 'desc';
  }): Promise<User[]> {
    return await this.userRepository.findMany(params);
  }
}
