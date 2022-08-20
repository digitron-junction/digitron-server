const KeyMessage = {
  invalidSignUpRqeust: 'invalid signup request',
  emailAlreadyExists: 'user already exists on that email',
  nicknameAlreadyExists: 'user already exists on that nickname',
};

export type MessageKey = keyof typeof KeyMessage;

export const getMessageByKey = (key: MessageKey): string => {
  return KeyMessage[key];
};
