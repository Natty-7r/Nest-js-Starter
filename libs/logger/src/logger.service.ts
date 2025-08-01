import { Injectable, Logger } from '@nestjs/common';
import config from 'src/common/config/app.config';
import { FileLogQueryDto } from './dto/file-log-query.dto';
import { ActivityLoggerStrategry } from './winston-logger/strategies/activity-logger.strategry';
import { ErrorLoggerStrategy } from './winston-logger/strategies/error-logger.strategry';
import { WinstonLoggerService } from './winston-logger/winston-logger.service';

@Injectable()
export class LoggerService {
  private static readonly baseLogger = new Logger(config.app.appName);

  constructor(
    private readonly activityLoggerStrategry: ActivityLoggerStrategry,
    private readonly errorLoggerStrategy: ErrorLoggerStrategy,
    private readonly winstonLoggerService: WinstonLoggerService,
  ) {}

  async getFileLogs(params: FileLogQueryDto) {
    return this.winstonLoggerService.getFileLogs(params);
  }

  log(message: string, metadata?: Record<string, unknown>) {
    this.winstonLoggerService.configure(this.activityLoggerStrategry);
    this.winstonLoggerService.log(message, metadata);
  }

  error(message: string, metadata?: Record<string, unknown>) {
    this.winstonLoggerService.configure(this.errorLoggerStrategy);
    this.winstonLoggerService.error(message, metadata);
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
