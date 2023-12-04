import {User} from '@domain/entities/user.entity';
import {Injectable} from '@nestjs/common';
import {UserRepository} from '@domain/repositories/user.repository';

type CreateUserRequest = {
  user_id: number;
  name: string;
};

@Injectable()
export class CreateUser {
  constructor(private userRepository: UserRepository) {}

  async execute(payload: CreateUserRequest): Promise<User> {
    return await this.userRepository.create(payload);
  }
}
