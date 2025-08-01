import { Global, Module } from '@nestjs/common';
import { WinstonLoggerService } from './winston-logger.service';
import { ActivityLoggerStrategry } from './strategies/activity-logger.strategry';
import { ErrorLoggerStrategy } from './strategies/error-logger.strategry';

@Global()
@Module({
  providers: [WinstonLoggerService, ActivityLoggerStrategry, ErrorLoggerStrategy],
  exports: [WinstonLoggerService, ActivityLoggerStrategry, ErrorLoggerStrategy],
})
export class WinstonLoggerModule {}
