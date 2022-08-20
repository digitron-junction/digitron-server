const KeyMessage = {
  invalidSignUpRqeust: 'invalid signup request',
  emailAlreadyExists: 'user already exists on that email',
  nicknameAlreadyExists: 'user already exists on that nickname',
  userNotfoundOrPasswordWrong:
    'Either the user does not exist or the password is not valid.',
  userNotfound: 'user was not found',
  invalidImage: 'invalid image',
  onlyStoreAccountAccess: 'only store account can access',
  productNotExists: 'product not exists',
  noPermissionToUpdateProduct: 'you cannot update product',
  orderNotfound: 'order not found',
  noPermissionToUpdateOrder: 'you cannot update order',
  reviewAlreadyExists: 'you already write review at this product',
  noStock: 'no stock remain',
  reviewNotfound: "review doesn't exists",
  noPermissionToUpdateReview: 'no permission to update review',
  noFollow: "you didn't follow before",
};

export type MessageKey = keyof typeof KeyMessage;

export const getMessageByKey = (key: MessageKey): string => {
  return KeyMessage[key];
};
