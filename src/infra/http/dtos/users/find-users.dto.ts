import {ApiPropertyOptional} from '@nestjs/swagger';
import {Transform} from 'class-transformer';
import {IsEnum, IsNumber, IsOptional} from 'class-validator';
import {OrderBy} from '../orders/find-orders.dto';

export class FindUsersDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({value}) => {
    return Number(value);
  })
  @IsNumber({allowNaN: false})
  take?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({value}) => {
    return Number(value);
  })
  @IsNumber({allowNaN: false})
  skip?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(OrderBy, {message: 'O valor da ordenação deve ser asc ou desc'})
  order?: 'asc' | 'desc';
}
