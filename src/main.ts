import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {ValidationPipe} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  SwaggerModule.setup(
    'api',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder().setTitle('API').setVersion('1.0').build(),
    ),
  );

  app.useGlobalPipes(new ValidationPipe({transform: true}));

  await app.listen(3000);
}
bootstrap();
