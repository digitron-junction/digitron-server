import { ServiceException } from '../service.exception';

export class InvalidSignUpArgumentException extends ServiceException {
  constructor() {
    super({
      code: 'badRequest',
      messageKey: 'invalidSignUpRqeust',
    });
  }
}

export class UserEmailAlreadyExistsException extends ServiceException {
  constructor() {
    super({
      code: 'recordAlreadyExists',
      messageKey: 'emailAlreadyExists',
    });
  }
}

export class UserNicknameAlreadyExistsException extends ServiceException {
  constructor() {
    super({
      code: 'recordAlreadyExists',
      messageKey: 'nicknameAlreadyExists',
    });
  }
}

export class UserNotfoundOrPasswordWrongException extends ServiceException {
  constructor() {
    super({
      code: 'noPermission',
      messageKey: 'userNotfoundOrPasswordWrong',
    });
  }
}

export class UserNotfoundException extends ServiceException {
  constructor() {
    super({
      code: 'noPermission',
      messageKey: 'userNotfound',
    });
  }
}

export class OnlyStoreAccountAccessException extends ServiceException {
  constructor() {
    super({
      code: 'badRequest',
      messageKey: 'onlyStoreAccountAccess',
    });
  }
}
