import { LoggerService } from '@libs/logger';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { ActivityLogData } from '../types/shared.type';
@Injectable()
export class ActivityInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const activityLog: ActivityLogData = {
      id: uuidv4(),
      method: request.method,
      ip: request.ip as string,
      level: 'info',
      url: request.originalUrl,
      status: response.statusCode,
      timestamp: new Date().toISOString(),
      res: {},
    };

    return next.handle().pipe(
      map((data) => {
        activityLog.res = data as Record<string, any>;
        return data as Record<string, any>;
      }),
      tap(() => {
        if (!(request.originalUrl.includes('/logs') || request.originalUrl === '/')) {
          this.loggerService.log('', { ...activityLog });
        }
      }),
    );
  }
}
