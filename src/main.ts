import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  //activer cors
  app.enableCors({
    origin:'http://localhost:4001',
  });
  await app.listen(process.env.BACKEND_PORT ?? 4011);
}
bootstrap();
