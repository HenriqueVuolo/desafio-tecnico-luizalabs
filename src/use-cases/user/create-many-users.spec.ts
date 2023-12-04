import {CreateManyUsers} from './create-many-users';
import {Test, TestingModule} from '@nestjs/testing';
import {UserRepository} from '@domain/repositories/user.repository';

const usersMock = [
  {
    user_id: 1,
    name: 'Henrique',
  },
  {
    user_id: 2,
    name: 'Vuolo',
  },
  {
    user_id: 3,
    name: 'Santana',
  },
];

describe('CreateManyUsers', () => {
  let createManyUsers: CreateManyUsers;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateManyUsers,
        {
          provide: UserRepository,
          useValue: {
            createMany: jest.fn(),
          },
        },
      ],
    }).compile();

    createManyUsers = module.get<CreateManyUsers>(CreateManyUsers);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('execute', () => {
    it('should call UserRepository.createMany', async () => {
      await createManyUsers.execute(usersMock);

      expect(userRepository.createMany).toHaveBeenCalledWith(usersMock);
    });
  });
});
