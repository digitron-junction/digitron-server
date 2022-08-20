import { ServiceException } from '../service.exception';

export class ReviewAlreadyExistsException extends ServiceException {
  constructor() {
    super({
      code: 'recordAlreadyExists',
      messageKey: 'reviewAlreadyExists',
    });
  }
}
