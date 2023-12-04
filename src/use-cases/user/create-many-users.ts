import {Injectable} from '@nestjs/common';
import {UserRepository} from '@domain/repositories/user.repository';

type CreateManyUsersRequest = {
  user_id: number;
  name: string;
}[];

@Injectable()
export class CreateManyUsers {
  constructor(private userRepository: UserRepository) {}

  async execute(payload: CreateManyUsersRequest): Promise<void> {
    await this.userRepository.createMany(payload);
  }
}
