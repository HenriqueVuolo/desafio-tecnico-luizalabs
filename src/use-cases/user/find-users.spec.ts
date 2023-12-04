import {FindUsers} from './find-users';
import {Test, TestingModule} from '@nestjs/testing';
import {UserRepository} from '@domain/repositories/user.repository';
import {User} from '@domain/entities/user.entity';

const userMock = new User({
  user_id: 1,
  name: 'Henrique',
});

describe('FindUsers', () => {
  let findUsers: FindUsers;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUsers,
        {
          provide: UserRepository,
          useValue: {
            findMany: jest.fn(),
          },
        },
      ],
    }).compile();

    findUsers = module.get<FindUsers>(FindUsers);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('execute', () => {
    it('should call UserRepository.findMany', async () => {
      const params = {
        skip: 20,
        take: 10,
        order: 'desc',
      };
      jest.spyOn(userRepository, 'findMany').mockResolvedValue([userMock]);

      const result = await findUsers.execute({
        ...params,
        order: params.order as 'desc',
      });

      expect(result[0]).toBeInstanceOf(User);
      expect(userRepository.findMany).toHaveBeenCalledWith(params);
    });
  });
});
