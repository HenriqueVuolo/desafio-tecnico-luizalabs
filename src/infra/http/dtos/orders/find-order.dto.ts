import {ApiProperty} from '@nestjs/swagger';
import {Transform} from 'class-transformer';
import {IsNumber, IsOptional} from 'class-validator';

export class FindOrderDto {
  @ApiProperty()
  @IsOptional()
  @Transform(({value}) => {
    return Number(value);
  })
  @IsNumber({allowNaN: false}, {message: 'ID de pedido inválido'})
  order_id?: number;
}
