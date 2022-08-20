import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiceExceptionFilter } from './filter/service.filter';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { winstonConfig } from './config/winston.config';

@Module({
  imports: [
    HealthCheckModule,
    PrismaModule,
    UserModule,
    WinstonModule.forRoot(winstonConfig),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ServiceExceptionFilter,
    },
  ],
})
export class AppModule {}
