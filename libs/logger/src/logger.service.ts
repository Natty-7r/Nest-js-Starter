import { Injectable, Logger } from '@nestjs/common';
import { ActivityLoggerStrategy } from './winston-logger/strategies/activity-logger.strategy';
import { ErrorLoggerStrategy } from './winston-logger/strategies/error-logger.strategy';
import { WinstonLoggerService } from './winston-logger/winston-logger.service';

@Injectable()
export class LoggerService {
  private static readonly baseLogger = new Logger('App');

  constructor(
    private readonly activityLoggerStrategy: ActivityLoggerStrategy,
    private readonly errorLoggerStrategy: ErrorLoggerStrategy,
    private readonly winstonLoggerService: WinstonLoggerService,
  ) {}

  log(message: string, metadata?: Record<string, unknown>) {
    this.winstonLoggerService.configure(this.activityLoggerStrategy);
    this.winstonLoggerService.log(message, metadata);
  }

  error(message: string, metadata?: Record<string, unknown>) {
    this.winstonLoggerService.configure(this.errorLoggerStrategy);
    this.winstonLoggerService.error(message, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>) {
    this.winstonLoggerService.configure(this.errorLoggerStrategy);
    this.winstonLoggerService.warn(message, metadata);
  }

  debug(message: string, metadata?: Record<string, unknown>) {
    this.winstonLoggerService.configure(this.activityLoggerStrategy);
    this.winstonLoggerService.debug(message, metadata);
  }

  verbose(message: string, metadata?: Record<string, unknown>) {
    this.winstonLoggerService.configure(this.activityLoggerStrategy);
    this.winstonLoggerService.verbose(message, metadata);
  }

  /** Static logger using Nest's built-in Logger */
  static nestLog(message: string) {
    this.baseLogger.log(message);
  }

  static nestError(message: string, trace?: string) {
    this.baseLogger.error(message, trace);
  }

  static nestWarn(message: string) {
    this.baseLogger.warn(message);
  }

  static nestDebug(message: string) {
    this.baseLogger.debug(message);
  }

  static nestVerbose(message: string) {
    this.baseLogger.verbose(message);
  }
}
