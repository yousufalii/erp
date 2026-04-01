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

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    const body = {
      success: false,
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      ...(typeof message === 'object' ? message : { message }),
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
