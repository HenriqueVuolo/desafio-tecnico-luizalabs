import {FindOrder} from './find-order';
import {Test, TestingModule} from '@nestjs/testing';
import {OrderRepository} from '@domain/repositories/order.repository';
import {Order} from '@domain/entities/order.entity';
import {NotFoundException} from '@nestjs/common';

const orderMock = new Order({
  order_id: 1,
  user_id: 1,
  date: '2023-12-03',
  products: [{product_id: 1, value: 10}],
});

describe('FindOrder', () => {
  let findOrder: FindOrder;
  let orderRepository: OrderRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOrder,
        {
          provide: OrderRepository,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    findOrder = module.get<FindOrder>(FindOrder);
    orderRepository = module.get<OrderRepository>(OrderRepository);
  });

  describe('execute', () => {
    it('should call OrderRepository.findOne', async () => {
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(orderMock);

      const result = await findOrder.execute(1);

      expect(result).toBeDefined();
      expect(orderRepository.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if no order is found', async () => {
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(null);

      expect(findOrder.execute(1)).rejects.toThrow(NotFoundException);
      expect(orderRepository.findOne).toHaveBeenCalledWith(1);
    });
  });
});
