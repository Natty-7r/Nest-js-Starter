import { LoggerService } from '@libs/logger';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  IntrinsicException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { parseStackTrace } from '../helpers/parser.helper';
import { ErrorLogData, StackTraceInfo } from '../types/shared.type';

@Catch()
export class ErrorExceptionFilter implements ExceptionFilter {
  constructor(private loggerService: LoggerService) {}

  catch(
    exception: (IntrinsicException & { property?: string }) | (Error & { property?: string }),
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const messageResponse = exception.message;
    const { property } = exception;
    let stackInfo: StackTraceInfo | undefined;

    if (exception instanceof Error) {
      stackInfo = parseStackTrace(exception.stack as string);
    }
    if (exception instanceof PrismaClientKnownRequestError) {
      stackInfo = parseStackTrace(exception.stack as string);
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
      // take user error as activity

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
}
