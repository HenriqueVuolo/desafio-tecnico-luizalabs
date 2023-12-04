import {Module} from '@nestjs/common';
import {ProcessFile} from '@useCases/file/process-file';
import {CreateManyOrders} from '@useCases/order/create-many-orders';
import {CreateManyUsers} from '@useCases/user/create-many-users';

@Module({
  imports: [],
  controllers: [],
  providers: [ProcessFile, CreateManyUsers, CreateManyOrders],
})
export class HttpModule {}
