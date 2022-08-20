import { ArgumentsHost, Catch, ExceptionFilter, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ServiceException } from '~/exception/service.exception';

function httpExceptionHandler(
  exception: ServiceException,
  host: ArgumentsHost,
  logger?: Logger,
) {
  const ctx = host.switchToHttp();
  const req = ctx.getRequest<Request>();
  const res = ctx.getResponse<Response>();

  logger?.info(`${exception.code} occurred`, {
    exceptionMessage: exception.message,

    api: `${req.method} ${req.path}`,
  });

  res.status(200).json({
    error: exception.toJson(),
  });
}

@Catch(ServiceException)
export class ServiceExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: ServiceException, host: ArgumentsHost) {
    const handler = httpExceptionHandler;
    return handler?.(exception, host, this.logger);
  }
}
