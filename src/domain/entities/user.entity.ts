import {ApiProperty} from '@nestjs/swagger';
import {Order} from './order.entity';

export interface IUser {
  user_id: number;
  name: string;
  orders?: Order[];
}

export class User implements IUser {
  @ApiProperty()
  readonly user_id: number;
  @ApiProperty()
  readonly name: string;
  @ApiProperty({isArray: true, type: Order})
  readonly orders?: Order[];

  constructor(props: IUser) {
    this.user_id = props.user_id;
    this.name = props.name;
    this.orders = props.orders;
  }
}
