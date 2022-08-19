import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const SwaggerOptions = new DocumentBuilder()
    .setTitle('Digitron')
    .setDescription('Digitron API Document')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, SwaggerOptions);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}

bootstrap();
