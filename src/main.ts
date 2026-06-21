import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { env } from 'process';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* ───────────────────────────── */
  /* GLOBAL CONFIG */
  /* ───────────────────────────── */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: 'http://localhost:4001',
    credentials: true,
  });

  /* ❌ SUPPRIMÉ : useStaticAssets */

  /* ───────────────────────────── */
  /* SWAGGER CONFIG */
  /* ───────────────────────────── */
  const config = new DocumentBuilder()
    .setTitle('E-tsenantsika API')
    .setDescription('Documentation API complete pour le projet E-tsenantsika')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(env.BACKEND_PORT ?? 4011);
}

bootstrap();