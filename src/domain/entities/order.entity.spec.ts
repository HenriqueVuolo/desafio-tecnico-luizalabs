import {Order} from './order.entity';

describe('Order', () => {
  const order_id = 1;
  const user_id = 1;
  const date = '2023-12-03';
  const products = [
    {
      product_id: 1,
      value: 20.1,
    },
    {
      product_id: 2,
      value: 30.5,
    },
  ];

  it('should create an order instance', () => {
    const order = new Order({
      order_id,
      user_id,
      date,
      products,
    });

    expect(order).toBeTruthy();
    expect(order).toBeInstanceOf(Order);
    expect(order.order_id).toBe(order_id);
    expect(order.user_id).toBe(user_id);
    expect(order.products).toBe(products);
  });

  it('should calculate the total correctly', () => {
    const order = new Order({
      order_id,
      user_id,
      date,
      products,
    });
    const productsTotal =
      Math.round(
        products.reduce((total, product) => total + product.value, 0) * 100,
      ) / 100;
    expect(order.total).toBe(productsTotal);
  });
});
