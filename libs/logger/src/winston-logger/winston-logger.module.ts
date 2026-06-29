import { Global, Module } from '@nestjs/common';
import { WinstonLoggerService } from './winston-logger.service';
import { ActivityLoggerStrategy } from './strategies/activity-logger.strategy';
import { ErrorLoggerStrategy } from './strategies/error-logger.strategy';

@Global()
@Module({
  providers: [WinstonLoggerService, ActivityLoggerStrategy, ErrorLoggerStrategy],
  exports: [WinstonLoggerService, ActivityLoggerStrategy, ErrorLoggerStrategy],
})
export class WinstonLoggerModule {}
