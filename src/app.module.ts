import {DatabaseModule} from '@infra/database/database.module';
import {HttpModule} from '@infra/http/http.module';
import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
