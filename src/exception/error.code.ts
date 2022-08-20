const DefaultMessages = {
  defaultMessage: 'server error',
  recordNotFound: 'cannot not found',
  recordAlreadyExists: 'It already exists',
  noPermission: 'no permission',
  userNotFound: 'can not found user',
  badRequest: 'Its bad request',
};

export type ErrorCode = keyof typeof DefaultMessages;

export const getDefaultMessage = (code: ErrorCode): string => {
  return DefaultMessages[code];
};
