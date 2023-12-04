import {Product} from '@domain/entities/order.entity';
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsDateString, IsNotEmpty, IsNumber, IsOptional} from 'class-validator';

export class CreateOrderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  order_id: number;

  @ApiProperty()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({isArray: true, type: Product})
  @IsNotEmpty()
  products: {product_id: number; value: number}[];

  @ApiPropertyOptional({example: '2023-12-03'})
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Formato de data inválido! Utilize YYYY-MM-DD ou YYYY-MM',
    },
  )
  date: string;
}
