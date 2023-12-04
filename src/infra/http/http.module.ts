import {Module} from '@nestjs/common';
import {ProcessFile} from '@useCases/file/process-file';
import {CreateManyUsers} from '@useCases/user/create-many-users';

@Module({
  imports: [],
  controllers: [],
  providers: [ProcessFile, CreateManyUsers],
})
export class HttpModule {}
