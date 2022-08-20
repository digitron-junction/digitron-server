import { ServiceException } from '../service.exception';

export class ProductNotExistsException extends ServiceException {
  constructor() {
    super({
      code: 'recordNotFound',
      messageKey: 'productNotExists',
    });
  }
}
