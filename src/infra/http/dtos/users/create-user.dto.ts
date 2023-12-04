import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';

export class CreateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  user_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
