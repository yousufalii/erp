import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;
    const errorMsg = typeof exceptionResponse === 'object' && exceptionResponse !== null 
      ? (exceptionResponse as any).message || (exceptionResponse as any).error 
      : (exceptionResponse || 'Internal server error');

    const body = {
      success: false,
      message: Array.isArray(errorMsg) ? errorMsg[0] : errorMsg,
      data: null,
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      timestamp: new Date().toISOString(),
    };

    Logger.error(
      `${httpAdapter.getRequestMethod(ctx.getRequest())} ${httpAdapter.getRequestUrl(
        ctx.getRequest(),
      )}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
    );

    httpAdapter.reply(ctx.getResponse(), body, httpStatus);
  }
}
