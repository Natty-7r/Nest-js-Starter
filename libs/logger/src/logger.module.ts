import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { WinstonLoggerModule } from './winston-logger/winstone-logger.module';

@Module({
  imports: [WinstonLoggerModule],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
