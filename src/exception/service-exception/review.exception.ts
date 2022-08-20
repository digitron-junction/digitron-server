import { ServiceException } from '../service.exception';

export class ReviewAlreadyExistsException extends ServiceException {
  constructor() {
    super({
      code: 'recordAlreadyExists',
      messageKey: 'reviewAlreadyExists',
    });
  }
}

export class ReviewNotfoundException extends ServiceException {
  constructor() {
    super({
      code: 'recordAlreadyExists',
      messageKey: 'reviewNotfound',
    });
  }
}

export class NoPermissionToUpdateReviewException extends ServiceException {
  constructor() {
    super({
      code: 'noPermission',
      messageKey: 'noPermissionToUpdateReview',
    });
  }
}
