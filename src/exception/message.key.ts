const KeyMessage = {
  invalidSignUpRqeust: 'invalid signup request',
  emailAlreadyExists: 'user already exists on that email',
  nicknameAlreadyExists: 'user already exists on that nickname',
  userNotfoundOrPasswordWrong:
    'Either the user does not exist or the password is not valid.',
  userNotfound: 'user was not found',
  invalidImage: 'invalid image',
};

export type MessageKey = keyof typeof KeyMessage;

export const getMessageByKey = (key: MessageKey): string => {
  return KeyMessage[key];
};
