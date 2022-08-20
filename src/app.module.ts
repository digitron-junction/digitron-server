import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiceExceptionFilter } from './filter/service.filter';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { winstonConfig } from './config/winston.config';
import { RavenInterceptor } from 'nest-raven';
import { RavenOption } from './config/raven.config';
import { CloudflareModule } from './modules/cloudflare/cloudflare.module';
import { ImageModule } from './modules/image/image.module';

@Module({
  imports: [
    HealthCheckModule,
    PrismaModule,
    UserModule,
    WinstonModule.forRoot(winstonConfig),
    CloudflareModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ServiceExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useValue: new RavenInterceptor(RavenOption),
    },
  ],
})
export class AppModule {}
