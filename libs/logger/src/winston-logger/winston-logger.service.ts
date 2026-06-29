import { Injectable } from '@nestjs/common';
import * as Winston from 'winston';
import { LoggerStrategy } from './interfaces/logger-strategy.interface';
import { LoggerType } from '@libs/shared/types/shared.type';

// Use require for DailyRotateFile
// eslint-disable-next-line @typescript-eslint/no-var-requires
const DailyRotateFile = require('winston-daily-rotate-file');

@Injectable()
export class WinstonLoggerService {
  private strategy!: LoggerStrategy;
  private logger!: Winston.Logger;
  loggerType!: LoggerType;

  configure(strategy: LoggerStrategy) {
    this.strategy = strategy;
    this.loggerType = this.strategy.getLoggerType();

    this.logger = Winston.createLogger({
      format: Winston.format.combine(
        Winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        Winston.format.json(),
      ),
      transports: [
        new DailyRotateFile({
          datePattern: 'YYYY-MM-DD',
          maxSize: '20mb',
          maxFiles: '14d',
          ...this.strategy.getLoggerConfig(),
        }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      const consoleTransport = new Winston.transports.Console({
        format: Winston.format.combine(
          Winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          Winston.format.simple(),
          Winston.format.colorize(),
        ),
      });
      this.logger.add(consoleTransport);
    }
  }

  log(message: string, metadata?: Record<string, unknown>) {
    this.logger.info(message, metadata);
  }

  error(message: string, metadata?: Record<string, unknown>) {
    this.logger.error(message, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>) {
    this.logger.warn(message, metadata);
  }

  debug(message: string, metadata?: Record<string, unknown>) {
    this.logger.debug(message, metadata);
  }

  verbose(message: string, metadata?: Record<string, unknown>) {
    this.logger.verbose(message, metadata);
  }
}
