import { ServiceException } from '../service.exception';

export class ImageInvalidException extends ServiceException {
  constructor() {
    super({
      code: 'badRequest',
      messageKey: 'invalidImage',
    });
  }
}
