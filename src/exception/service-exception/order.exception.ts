import { ServiceException } from '../service.exception';

export class OrderNotfoundException extends ServiceException {
  constructor() {
    super({
      code: 'recordNotFound',
      messageKey: 'orderNotfound',
    });
  }
}

export class NoPermissionToUpdateOrderException extends ServiceException {
  constructor() {
    super({
      code: 'noPermission',
      messageKey: 'noPermissionToUpdateOrder',
    });
  }
}

export class NoStockException extends ServiceException {
  constructor() {
    super({
      code: 'badRequest',
      messageKey: 'noStock',
    });
  }
}
