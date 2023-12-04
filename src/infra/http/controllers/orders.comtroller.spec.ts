import {OrdersController} from './orders.controller';
import {Test, TestingModule} from '@nestjs/testing';
import {FindOrders} from '@useCases/order/find-orders';
import {FindOrder} from '@useCases/order/find-order';
import {CreateOrder} from '@useCases/order/create-order';
import {Order} from '@domain/entities/order.entity';
import {BadRequestException, NotFoundException} from '@nestjs/common';

const ordersMock: Order[] = [
  new Order({
    order_id: 1,
    user_id: 1,
    date: '2023-12-03',
    products: [
      {
        product_id: 1,
        value: 10,
      },
    ],
  }),
];

describe('OrderController', () => {
  let ordersController: OrdersController;
  let findOrder: FindOrder;
  let findOrders: FindOrders;
  let createOrder: CreateOrder;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: FindOrder,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindOrders,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: CreateOrder,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    ordersController = module.get<OrdersController>(OrdersController);
    findOrder = module.get<FindOrder>(FindOrder);
    findOrders = module.get<FindOrders>(FindOrders);
    createOrder = module.get<CreateOrder>(CreateOrder);
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      jest.spyOn(findOrders, 'execute').mockResolvedValue(ordersMock);

      const params = {
        from: '2023-01',
        to: '2023-12',
        skip: 20,
        take: 10,
        user_id: 1,
        order: 'desc',
      };

      await ordersController.findAll({
        ...params,
        order: params.order as 'desc',
      });

      expect(findOrders.execute).toHaveBeenCalledWith(params);
    });
  });

  describe('findOne', () => {
    it('should return an array of orders', async () => {
      jest.spyOn(findOrder, 'execute').mockResolvedValue(ordersMock[0]);

      await ordersController.findById({order_id: 1});

      expect(findOrder.execute).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if use-case throw it', async () => {
      jest
        .spyOn(findOrder, 'execute')
        .mockRejectedValue(new NotFoundException());

      let error;
      try {
        await ordersController.findById({order_id: 1});
      } catch (err) {
        error = err;
      }

      expect(findOrder.execute).toHaveBeenCalledWith(1);
      expect(error).toBeInstanceOf(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create an order', async () => {
      jest.spyOn(createOrder, 'execute').mockResolvedValue(ordersMock[0]);

      await ordersController.create(ordersMock[0]);

      expect(createOrder.execute).toHaveBeenCalled();
    });

    it('should throw BadRequestException if use-case throw it', async () => {
      jest
        .spyOn(createOrder, 'execute')
        .mockRejectedValue(new BadRequestException());

      let error;
      try {
        await ordersController.create(ordersMock[0]);
      } catch (err) {
        error = err;
      }

      expect(createOrder.execute).toHaveBeenCalled();
      expect(error).toBeInstanceOf(BadRequestException);
    });
  });
});
