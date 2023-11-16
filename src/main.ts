import { ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

import fastifyCookie from '@fastify/cookie';

import { AppConfig } from './modules/app/app.config';
import { AppModule } from './modules/app/app.module';
import { PrismaClientExceptionFilter } from './modules/prisma/exception/prisma-client-exception.filter';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ResponseInterceptor } from './modules/app/app.interceptor';
import { ErrorFilter } from './modules/errors/error.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableShutdownHooks();

  const appConfig = app.get(AppConfig);

  // Глобальный interceptor для вывода результата запроса
  app.useGlobalInterceptors(new ResponseInterceptor());

  const { httpAdapter } = app.get(HttpAdapterHost);
  // Глобальный фильтр для обработки исключений
  app.useGlobalFilters(
    new PrismaClientExceptionFilter(httpAdapter),
    new ErrorFilter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  //выставляем версию api
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  //работаем с cookie
  await app.register(fastifyCookie, {
    secret: appConfig.COOKIE_SECRET,
  });

  app.enableCors({
    credentials: true,
    origin: appConfig.FRONTEND_URL,
  });

  const config = new DocumentBuilder()
    .setTitle('Методы API')
    .setDescription('API сервис')
    .setVersion('v1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(appConfig.APP_PORT, '0.0.0.0');
  const appUri = await app.getUrl();
  Logger.log(`🚀 Application is running on: ${appUri}`);
}

bootstrap();
