import {Module} from '@nestjs/common';
import {ProcessFile} from '@useCases/file/process-file';

@Module({
  imports: [],
  controllers: [],
  providers: [ProcessFile],
})
export class HttpModule {}
