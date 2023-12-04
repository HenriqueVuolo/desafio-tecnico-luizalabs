import {CreateUser} from './create-user';
import {Test, TestingModule} from '@nestjs/testing';
import {UserRepository} from '@domain/repositories/user.repository';

const userMock = {
  user_id: 1,
  name: 'Henrique',
};

describe('CreateUser', () => {
  let createUser: CreateUser;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUser,
        {
          provide: UserRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    createUser = module.get<CreateUser>(CreateUser);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('execute', () => {
    it('should call UserRepository.create', async () => {
      await createUser.execute(userMock);

      expect(userRepository.create).toHaveBeenCalledWith(userMock);
    });
  });
});
