import { ServiceException } from '../service.exception';

export class NoFollowException extends ServiceException {
  constructor() {
    super({
      code: 'recordNotFound',
      messageKey: 'noFollow',
    });
  }
}
