import {FindUser} from './find-user';
import {Test, TestingModule} from '@nestjs/testing';
import {UserRepository} from '@domain/repositories/user.repository';
import {User} from '@domain/entities/user.entity';
import {NotFoundException} from '@nestjs/common';

const userMock = new User({
  user_id: 1,
  name: 'Henrique',
});

describe('FindUser', () => {
  let findUser: FindUser;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUser,
        {
          provide: UserRepository,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    findUser = module.get<FindUser>(FindUser);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('execute', () => {
    it('should call UserRepository.findOne', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userMock);

      const result = await findUser.execute(1);

      expect(result).toBeDefined();
      expect(userRepository.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if no user is found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      expect(findUser.execute(1)).rejects.toThrow(NotFoundException);
      expect(userRepository.findOne).toHaveBeenCalledWith(1);
    });
  });
});
