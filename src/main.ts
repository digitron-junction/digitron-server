import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { loadConfig } from './config/config';
import { LOGGER_FORMAT } from './config/constants';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import { initSentry } from './sentry';

async function bootstrap() {
  await loadConfig();
  await initSentry();

  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.enableCors({
    credentials: true,
  });
  app.use(cookieParser());

  app.use(
    morgan(LOGGER_FORMAT, {
      skip: (req) => {
        return req.url.includes('/health-check') || req.url === '/';
      },
    }),
  );

  const SwaggerOptions = new DocumentBuilder()
    .setTitle('Digitron')
    .setDescription('Digitron API Document')
    .setVersion('0.1')
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const document = SwaggerModule.createDocument(app, SwaggerOptions);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}

bootstrap();
