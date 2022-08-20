import { ErrorCode, getDefaultMessage } from './error.code';
import { getMessageByKey, MessageKey } from './message.key';

export type ServiceErrorJson = {
  code: string;
  message: string;
  messageKey: MessageKey | null;
};

export class ServiceException extends Error {
  private _message: string | null;
  private _code: ErrorCode;

  private _messageKey: MessageKey | null;

  constructor(exception: {
    code: ErrorCode;
    message?: string;
    messageKey?: MessageKey;
  }) {
    super();
    this._code = exception.code;

    this._messageKey = exception.messageKey ?? null;
    this._message = exception.message ?? null;
  }

  get code() {
    return this._code;
  }

  get message() {
    if (this._messageKey) return getMessageByKey(this._messageKey);
    if (this._message) return this._message;

    return getDefaultMessage(this._code);
  }

  toJson(): ServiceErrorJson {
    const message = this._messageKey
      ? getMessageByKey(this._messageKey)
      : this.message;

    return {
      code: this.code,
      message,
      messageKey: this._messageKey,
    };
  }
}
