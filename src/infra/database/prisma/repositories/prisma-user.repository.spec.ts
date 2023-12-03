import {Test, TestingModule} from '@nestjs/testing';
import {PrismaUserRepository} from './prisma-user.repository';
import {PrismaService} from '../prisma.service';
import {BadRequestException} from '@nestjs/common';
import {User} from '@domain/entities/user.entity';
import {Order as PrismaOrder, User as PrismaUser} from '@prisma/client';
import {PrismaUserMapper} from '../mappers/prisma-user.mappers';

const createUserDataMock: User = {
  user_id: 1,
  name: 'Henrique',
  orders: [],
};

const createUsersDataMock: User[] = [
  createUserDataMock,
  {...createUserDataMock, user_id: 2},
];

const prismaUsersMock: PrismaUser[] = [
  PrismaUserMapper.toPrisma(new User(createUserDataMock)),
];

const prismaUsersWithOrderMock: (PrismaUser & {orders: PrismaOrder[]})[] = [
  {...PrismaUserMapper.toPrisma(new User(createUserDataMock)), orders: []},
];

describe('PrismaUserRepository', () => {
  let prismaUserRepository: PrismaUserRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaUserRepository,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: jest.fn(),
              create: jest.fn(),
              createMany: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
            $queryRaw: jest.fn(),
          },
        },
      ],
    }).compile();

    prismaUserRepository =
      module.get<PrismaUserRepository>(PrismaUserRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create an user', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);
      jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValue(prismaUsersMock[0]);

      const result = await prismaUserRepository.create(createUserDataMock);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(User);
      expect(prismaService.user.findFirst).toHaveBeenCalled();
      expect(prismaService.user.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if user already exists', async () => {
      jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValue(prismaUsersMock[0]);

      const result = await expect(
        prismaUserRepository.create(createUserDataMock),
      ).rejects.toThrow(BadRequestException);

      expect(result).not.toBeDefined();
      expect(prismaService.user.findFirst).toHaveBeenCalled();
      expect(prismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('createMany', () => {
    it('should create all users if no one already exists', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

      await prismaUserRepository.createMany(createUsersDataMock);

      expect(prismaService.user.findFirst).toHaveBeenCalled();
      expect(prismaService.user.createMany).toHaveBeenCalledWith({
        data: createUsersDataMock.map((user) =>
          PrismaUserMapper.toPrisma(user),
        ),
      });
    });

    it('should not create any users if they all already exist', async () => {
      jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValue(prismaUsersMock[0]);

      await prismaUserRepository.createMany(createUsersDataMock);

      expect(prismaService.user.findFirst).toHaveBeenCalled();
      expect(prismaService.user.createMany).toHaveBeenCalledWith({
        data: [],
      });
    });
  });

  describe('findMany', () => {
    it('should return an array of users', async () => {
      jest
        .spyOn(prismaService.user, 'findMany')
        .mockResolvedValue(prismaUsersWithOrderMock);

      const params = {
        skip: 20,
        take: 10,
        order: 'desc',
      };
      const result = await prismaUserRepository.findMany({
        ...params,
        order: params.order as 'desc',
      });

      expect(result).toBeDefined();
      expect(result[0]).toBeInstanceOf(User);
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        take: params.take,
        skip: params.skip,
        orderBy: {
          id: params.order,
        },
        include: {orders: {orderBy: {createdAt: 'desc'}}},
      });
    });

    it('should return an empty array if no user is found', async () => {
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue([]);

      const result = await prismaUserRepository.findMany({});

      expect(result).toBeDefined();
      expect(result).toHaveLength(0);
      expect(prismaService.user.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an user', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(prismaUsersMock[0]);

      const result = await prismaUserRepository.findOne(1);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(User);
      expect(prismaService.user.findUnique).toHaveBeenCalled();
    });

    it('should return null if no user is found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await prismaUserRepository.findOne(1);

      expect(result).toBe(null);
      expect(prismaService.user.findUnique).toHaveBeenCalled();
    });
  });
});
