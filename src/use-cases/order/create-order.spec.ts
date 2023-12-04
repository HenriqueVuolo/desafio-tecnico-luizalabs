import {CreateOrder} from './create-order';
import {Test, TestingModule} from '@nestjs/testing';
import {OrderRepository} from '@domain/repositories/order.repository';

const orderMock = {
  order_id: 1,
  user_id: 1,
  date: '2023-12-03',
  products: [{product_id: 1, value: 10}],
};

describe('CreateOrder', () => {
  let createOrder: CreateOrder;
  let orderRepository: OrderRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrder,
        {
          provide: OrderRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    createOrder = module.get<CreateOrder>(CreateOrder);
    orderRepository = module.get<OrderRepository>(OrderRepository);
  });

  describe('execute', () => {
    it('should call OrderRepository.create', async () => {
      await createOrder.execute(orderMock);

      expect(orderRepository.create).toHaveBeenCalledWith(orderMock);
    });
  });
});
