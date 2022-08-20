import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {
  OnlyStoreAccountAccessException,
  UserNotfoundException,
} from '~/exception/service-exception/user.exception';

import { UserService } from '~/modules/user/user.service';
import { RequiredUserRequest } from '~/types/request';

/**
 * user, non-user 체크 하고 인가는 안하는 가드
 */
@Injectable()
export class RequiredStoreUserGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequiredUserRequest>();
    const token = request.header('x-auth-token');

    if (!token) throw new UserNotfoundException();

    let user;

    try {
      user = await this.userService.getUserByAuthToken(token);
    } catch (error) {
      throw error;
    }

    if (!user.store) {
      throw new OnlyStoreAccountAccessException();
    }

    request.user = user;
    return true;
  }
}
