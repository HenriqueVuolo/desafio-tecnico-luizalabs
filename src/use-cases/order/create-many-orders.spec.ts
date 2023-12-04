import {CreateManyOrders} from './create-many-orders';
import {Test, TestingModule} from '@nestjs/testing';
import {OrderRepository} from '@domain/repositories/order.repository';

const ordersMock = [
  {
    order_id: 1,
    user_id: 1,
    date: '2023-12-03',
    products: [{product_id: 1, value: 10}],
  },
  {
    order_id: 2,
    user_id: 2,
    date: '2023-12-03',
    products: [{product_id: 1, value: 10}],
  },
  {
    order_id: 3,
    user_id: 3,
    date: '2023-12-03',
    products: [{product_id: 1, value: 10}],
  },
];

describe('CreateManyOrders', () => {
  let createManyOrders: CreateManyOrders;
  let orderRepository: OrderRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateManyOrders,
        {
          provide: OrderRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    createManyOrders = module.get<CreateManyOrders>(CreateManyOrders);
    orderRepository = module.get<OrderRepository>(OrderRepository);
  });

  describe('execute', () => {
    it('should call OrderRepository.create multiple times', async () => {
      await createManyOrders.execute(ordersMock);

      expect(orderRepository.create).toHaveBeenCalledTimes(ordersMock.length);
    });

    it('should not call OrderRepository.create', async () => {
      await createManyOrders.execute([]);

      expect(orderRepository.create).not.toHaveBeenCalled();
    });
  });
});
