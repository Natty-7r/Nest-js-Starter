import { LoggerType } from '@app/shared/types/shared.type';

export interface LoggerStrategy {
  getLoggerConfig(): Record<string, unknown>;
  getLoggerType(): LoggerType;
}
