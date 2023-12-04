import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import {CreateUser} from '@useCases/user/create-user';
import {FindUser} from '@useCases/user/find-user';
import {FindUsers} from '@useCases/user/find-users';
import {CreateUserDto} from '../dtos/users/create-user.dto';
import {FindUserDto} from '../dtos/users/find-user.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import {User} from '@domain/entities/user.entity';
import {FindUsersDto} from '../dtos/users/find-users.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private findUser: FindUser,
    private findUsers: FindUsers,
    private createUser: CreateUser,
  ) {}

  @Get()
  @ApiOperation({summary: 'Get all users'})
  @ApiResponse({
    status: 200,
    isArray: true,
    type: User,
  })
  async findAll(@Query() params: FindUsersDto) {
    return await this.findUsers.execute(params);
  }

  @Get(':user_id')
  @ApiOperation({summary: 'Get user by id'})
  @ApiResponse({
    status: 200,
    type: User,
  })
  @ApiNotFoundResponse({
    status: 404,
  })
  async findById(@Param() {user_id}: FindUserDto) {
    return await this.findUser.execute(user_id);
  }

  @Post()
  @ApiOperation({summary: 'Create user'})
  @ApiResponse({
    status: 200,
    type: User,
  })
  async create(@Body() payload: CreateUserDto): Promise<User> {
    return await this.createUser.execute(payload);
  }
}
