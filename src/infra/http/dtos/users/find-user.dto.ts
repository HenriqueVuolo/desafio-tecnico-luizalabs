import {ApiProperty} from '@nestjs/swagger';
import {Transform} from 'class-transformer';
import {IsNumber, IsOptional} from 'class-validator';

export class FindUserDto {
  @ApiProperty()
  @IsOptional()
  @Transform(({value}) => {
    return Number(value);
  })
  @IsNumber({allowNaN: false}, {message: 'ID de usuário inválido'})
  user_id?: number;
}
