import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from '@libs/logger';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorExceptionFilter } from '@libs/shared/filters/error.filter';
import { ActivityInterceptor } from '@libs/shared/interceptors/activity.interceptor';

@Module({
  imports: [LoggerModule],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: ErrorExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ActivityInterceptor },
    AppService,
  ],
})
export class AppModule {}
