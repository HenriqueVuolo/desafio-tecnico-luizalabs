import {Test, TestingModule} from '@nestjs/testing';
import {PrismaOrderRepository} from './prisma-order.repository';
import {PrismaService} from '../prisma.service';
import {PrismaOrderMapper} from '../mappers/prisma-order.mappers';
import {Order, OrderData} from '@domain/entities/order.entity';
import {Order as PrismaOrder} from '@prisma/client';
import {BadRequestException} from '@nestjs/common';

const createOrderDataMock: OrderData = {
  order_id: 1,
  user_id: 1,
  date: '2023-12-03',
  products: [{product_id: 1, value: 10}],
};

const prismaOrdersMock: PrismaOrder[] = [
  PrismaOrderMapper.toPrisma(new Order(createOrderDataMock)),
];

describe('PrismaOrderRepository', () => {
  let prismaOrderRepository: PrismaOrderRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaOrderRepository,
        {
          provide: PrismaService,
          useValue: {
            order: {
              findFirst: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
            $queryRaw: jest.fn(),
          },
        },
      ],
    }).compile();

    prismaOrderRepository = module.get<PrismaOrderRepository>(
      PrismaOrderRepository,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create an order', async () => {
      jest.spyOn(prismaService.order, 'findFirst').mockResolvedValue(null);
      jest
        .spyOn(prismaService.order, 'create')
        .mockResolvedValue(prismaOrdersMock[0]);

      const result = await prismaOrderRepository.create(createOrderDataMock);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Order);
      expect(prismaService.order.findFirst).toHaveBeenCalled();
      expect(prismaService.order.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if order already exists', async () => {
      jest
        .spyOn(prismaService.order, 'findFirst')
        .mockResolvedValue(prismaOrdersMock[0]);

      const result = await expect(
        prismaOrderRepository.create(createOrderDataMock),
      ).rejects.toThrow(BadRequestException);

      expect(result).not.toBeDefined();
      expect(prismaService.order.findFirst).toHaveBeenCalled();
      expect(prismaService.order.create).not.toHaveBeenCalled();
    });
  });

  describe('findMany', () => {
    it('should return an array of orders', async () => {
      jest
        .spyOn(prismaService.order, 'findMany')
        .mockResolvedValue(prismaOrdersMock);

      const params = {
        from: '2023-01',
        to: '2023-12',
        skip: 20,
        take: 10,
        user_id: 1,
        order: 'desc',
      };
      const result = await prismaOrderRepository.findMany({
        ...params,
        order: params.order as 'desc',
      });

      expect(result).toBeDefined();
      expect(result[0]).toBeInstanceOf(Order);
      expect(prismaService.order.findMany).toHaveBeenCalledWith({
        where: {
          userId: params.user_id,
          createdAt: {
            gt: new Date(params.from),
            lt: new Date(params.to),
          },
        },
        take: params.take,
        skip: params.skip,
        orderBy: {
          createdAt: params.order,
        },
      });
    });

    it('should return an empty array if no order is found', async () => {
      jest.spyOn(prismaService.order, 'findMany').mockResolvedValue([]);

      const result = await prismaOrderRepository.findMany({});

      expect(result).toBeDefined();
      expect(result.length).toBe(0);
      expect(prismaService.order.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an order', async () => {
      jest
        .spyOn(prismaService.order, 'findUnique')
        .mockResolvedValue(prismaOrdersMock[0]);

      const result = await prismaOrderRepository.findOne(1);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Order);
      expect(prismaService.order.findUnique).toHaveBeenCalled();
    });

    it('should return null if no order is found', async () => {
      jest.spyOn(prismaService.order, 'findUnique').mockResolvedValue(null);

      const result = await prismaOrderRepository.findOne(1);

      expect(result).toBe(null);
      expect(prismaService.order.findUnique).toHaveBeenCalled();
    });
  });
});
