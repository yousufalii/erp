import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ACTIVITY_KEY, ActivityOptions } from '../decorators/activity.decorator';
import { ActivityLogService } from '../activity-log/activity-log.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly activityLogService: ActivityLogService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const activityOptions = this.reflector.getAllAndOverride<ActivityOptions>(
      ACTIVITY_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!activityOptions) {
      return next.handle(); // Only log if @Activity is present
    }

    const request = context.switchToHttp().getRequest();
    const { user, body, ip, headers } = request;
    const userAgent = headers['user-agent'] || 'unknown';

    return next.handle().pipe(
      tap(() => {
        // Success Log
        this.activityLogService.log({
          action: activityOptions.action,
          module: activityOptions.module,
          payload: body,
          user: user, // user will be null if not authenticated yet
          ipAddress: ip,
          userAgent: userAgent,
          status: true,
        });
      }),
      catchError((error) => {
        // Failure Log
        this.activityLogService.log({
          action: activityOptions.action,
          module: activityOptions.module,
          payload: body,
          user: user,
          ipAddress: ip,
          userAgent: userAgent,
          status: false,
          errorMessage: error.message || 'Action failed.',
        });
        return throwError(() => error);
      }),
    );
  }
}
