import { user } from '@prisma/client';
import { Request } from 'express';

export interface OptionalUserRequest extends Request {
  user: user | null;
}

export interface RequiredUserRequest extends Request {
  user: user;
}