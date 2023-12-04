import {Injectable, NotFoundException} from '@nestjs/common';
import {User} from '@domain/entities/user.entity';
import {UserRepository} from '@domain/repositories/user.repository';

@Injectable()
export class FindUser {
  constructor(private userRepository: UserRepository) {}

  async execute(user_id: number): Promise<User> {
    const user = await this.userRepository.findOne(user_id);

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    return user;
  }
}
