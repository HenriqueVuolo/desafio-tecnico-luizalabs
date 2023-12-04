import {ApiPropertyOptional} from '@nestjs/swagger';
import {Transform} from 'class-transformer';
import {IsDateString, IsEnum, IsNumber, IsOptional} from 'class-validator';

export enum OrderBy {
  asc = 'asc',
  desc = 'desc',
}

export class FindOrdersDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({value}) => {
    return Number(value);
  })
  @IsNumber({allowNaN: false}, {message: 'ID de usuário inválido'})
  user_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString({}, {message: 'Data de início inválida'})
  from?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString({}, {message: 'Data de fim inválida'})
  to?: string;

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
