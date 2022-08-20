import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { loadConfig } from './config/config';

async function bootstrap() {
  await loadConfig();

  const app = await NestFactory.create(AppModule);

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
