import { LoggerService } from '@libs/logger';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { ErrorLogData, StackTraceInfo } from '../types/shared.type';

@Catch()
export class ErrorExceptionFilter implements ExceptionFilter {
  constructor(private loggerService: LoggerService) { }

  catch(
    exception: (Error & { property?: string }),
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const messageResponse = exception.message;
    const { property } = exception;
    let stackInfo: StackTraceInfo | undefined;

    if (exception instanceof Error) {
      stackInfo = this.parseStackTrace(exception.stack as string);
    }

    const { message, statusCode } =
      exception instanceof HttpException
        ? {
          message: exception.getResponse(),
          statusCode: exception.getStatus(),
        }
        : {
          message: 'Internal Server Error',
          statusCode: 500,
        };

    const loggerResponse: ErrorLogData = {
      id: uuid(),
      status: statusCode,
      url: request.url,
      level: 'error',
      method: request.method,
      ip: request.ip as string,
      timestamp: new Date().toISOString(),
      stack: exception instanceof Error ? exception.stack : '',
    };

    if (statusCode >= 400 && statusCode < 500) {
      this.loggerService.log(
        typeof message !== 'string' ? (message as Record<string, string>).message : message,
        {
          ...loggerResponse,
        },
      );
    } else {
      this.loggerService.error(
        typeof message !== 'string' ? (message as Record<string, string>).message : message,
        {
          ...loggerResponse,
          ...stackInfo,
        },
      );
    }

    response.status(statusCode).json({
      statusCode,
      message: messageResponse,
      property,
    });
  }

  private parseStackTrace(stack: string): StackTraceInfo {
    const lines = stack.split('\n');
    const [type] = lines[0].split(':');
    const errorType = type;

    const stackInfo: StackTraceInfo = {
      fileName: '',
      row: '',
      col: '',
      errorType,
    };

    const stackTracePattern = /at .+ \(([^:]+):(\d+):(\d+)\)/;
    const match = lines[1]?.match(stackTracePattern);

    if (match) {
      const [, filePath, row, col] = match;
      stackInfo.fileName = filePath.split('/').pop() || '';
      stackInfo.row = row;
      stackInfo.col = col;
    }
    return stackInfo;
  }
}
