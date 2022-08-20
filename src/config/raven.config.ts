import { HttpException } from '@nestjs/common';
import { IRavenInterceptorOptions } from 'nest-raven';
import { ServiceException } from '~/exception/service.exception';

export const RavenOption: IRavenInterceptorOptions = {
  filters: [
    {
      type: HttpException,
      filter: (exception: HttpException) =>
        [403, 404].includes(exception.getStatus()), // 403, 404에러는 sentry에 쌓지 않음
    },
    {
      type: ServiceException,
    },
  ],
};
