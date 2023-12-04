import {FindOrders} from './find-orders';
import {Test, TestingModule} from '@nestjs/testing';
import {OrderRepository} from '@domain/repositories/order.repository';
import {Order} from '@domain/entities/order.entity';

const orderMock = new Order({
  order_id: 1,
  user_id: 1,
  date: '2023-12-03',
  products: [{product_id: 1, value: 10}],
});

describe('FindOrders', () => {
  let findOrders: FindOrders;
  let orderRepository: OrderRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOrders,
        {
          provide: OrderRepository,
          useValue: {
            findMany: jest.fn(),
          },
        },
      ],
    }).compile();

    findOrders = module.get<FindOrders>(FindOrders);
    orderRepository = module.get<OrderRepository>(OrderRepository);
  });

  describe('execute', () => {
    it('should call OrderRepository.findMany', async () => {
      const params = {
        from: '2023-01',
        to: '2023-12',
        skip: 20,
        take: 10,
        user_id: 1,
        order: 'desc',
      };
      jest.spyOn(orderRepository, 'findMany').mockResolvedValue([orderMock]);

      const result = await findOrders.execute({
        ...params,
        order: params.order as 'desc',
      });

      expect(result[0]).toBeInstanceOf(Order);
      expect(orderRepository.findMany).toHaveBeenCalledWith(params);
    });
  });
});
