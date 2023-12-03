import {Replace} from '@helpers/index';
import {ApiProperty} from '@nestjs/swagger';

export interface IOrder {
  order_id: number;
  user_id: number;
  total: number;
  products: {
    product_id: number;
    value: number;
  }[];
  date: string;
}

export class Product {
  @ApiProperty()
  product_id: number;

  @ApiProperty()
  value: number;
}

export interface OrderData
  extends Replace<IOrder, {order_id?: number; date?: string; total?: number}> {}

export class Order implements IOrder {
  @ApiProperty()
  readonly order_id: number;
  @ApiProperty()
  readonly user_id: number;
  @ApiProperty()
  readonly total: number;
  @ApiProperty({
    isArray: true,
    type: Product,
  })
  readonly products: {product_id: number; value: number}[];
  @ApiProperty()
  readonly date: string;

  constructor(props: OrderData) {
    this.order_id = props.order_id;
    this.user_id = props.user_id;
    this.products = props.products;
    this.date = props.date;
    this.total = this.total || this.calculateTotal();
  }

  private calculateTotal() {
    return (
      Math.round(
        this.products?.reduce((total, product) => total + product.value, 0) *
          100,
      ) / 100
    );
  }
}
