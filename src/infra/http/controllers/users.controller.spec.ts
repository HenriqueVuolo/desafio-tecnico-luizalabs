import {UsersController} from './users.controller';
import {Test, TestingModule} from '@nestjs/testing';
import {BadRequestException, NotFoundException} from '@nestjs/common';
import {FindUser} from '@useCases/user/find-user';
import {CreateUser} from '@useCases/user/create-user';
import {FindUsers} from '@useCases/user/find-users';
import {User} from '@domain/entities/user.entity';

const usersMock: User[] = [new User({user_id: 1, name: 'Henrique'})];

describe('UsersController', () => {
  let usersController: UsersController;
  let findUser: FindUser;
  let findUsers: FindUsers;
  let createUser: CreateUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: FindUser,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindUsers,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: CreateUser,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    findUser = module.get<FindUser>(FindUser);
    findUsers = module.get<FindUsers>(FindUsers);
    createUser = module.get<CreateUser>(CreateUser);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest.spyOn(findUsers, 'execute').mockResolvedValue(usersMock);

      const params = {
        skip: 20,
        take: 10,
        order: 'desc',
      };

      await usersController.findAll({
        ...params,
        order: params.order as 'desc',
      });

      expect(findUsers.execute).toHaveBeenCalledWith(params);
    });
  });

  describe('findOne', () => {
    it('should return an user', async () => {
      jest.spyOn(findUser, 'execute').mockResolvedValue(usersMock[0]);

      await usersController.findById({user_id: 1});

      expect(findUser.execute).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if use-case throw it', async () => {
      jest
        .spyOn(findUser, 'execute')
        .mockRejectedValue(new NotFoundException());

      let error;
      try {
        await usersController.findById({user_id: 1});
      } catch (err) {
        error = err;
      }

      expect(findUser.execute).toHaveBeenCalledWith(1);
      expect(error).toBeInstanceOf(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create an user', async () => {
      jest.spyOn(createUser, 'execute').mockResolvedValue(usersMock[0]);

      await usersController.create(usersMock[0]);

      expect(createUser.execute).toHaveBeenCalled();
    });

    it('should throw BadRequestException if use-case throw it', async () => {
      jest
        .spyOn(createUser, 'execute')
        .mockRejectedValue(new BadRequestException());

      let error;
      try {
        await usersController.create(usersMock[0]);
      } catch (err) {
        error = err;
      }

      expect(createUser.execute).toHaveBeenCalled();
      expect(error).toBeInstanceOf(BadRequestException);
    });
  });
});
