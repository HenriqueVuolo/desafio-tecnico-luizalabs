import {Module} from '@nestjs/common';
import {ProcessFile} from '@useCases/file/process-file';
import {CreateManyOrders} from '@useCases/order/create-many-orders';
import {CreateManyUsers} from '@useCases/user/create-many-users';
import {FilesController} from './controllers/files.controller';
import {CreateUser} from '@useCases/user/create-user';
import {CreateOrder} from '@useCases/order/create-order';
import {FindUser} from '@useCases/user/find-user';
import {FindUsers} from '@useCases/user/find-users';
import {FindOrder} from '@useCases/order/find-order';

@Module({
  imports: [],
  controllers: [FilesController],
  providers: [
    ProcessFile,
    CreateManyUsers,
    CreateUser,
    FindUser,
    FindUsers,
    CreateManyOrders,
    CreateOrder,
    FindOrder,
  ],
})
export class HttpModule {}
