import { store, user } from '@prisma/client';
import { Request } from 'express';

export interface OptionalUserRequest extends Request {
  user: user | null;
}

export interface RequiredUserRequest extends Request {
  user: user & { store: store | null };
}

export interface RequiredStoreUserRequest extends Request {
  user: user & { store: store };
}
