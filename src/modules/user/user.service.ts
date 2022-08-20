import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { UserKindEnum } from '~/entity/user.entity';
import {
  UserEmailAlreadyExistsException,
  UserNicknameAlreadyExistsException,
} from '~/exception/service-exception/user.exception';

import { PrismaService } from '../prisma/prisma.service';
import { signupUserZodSchema } from './user.controller';
import { hash } from 'bcrypt';
import { getConfig } from '~/config/config';
import * as sha from 'sha.js';
import { match } from 'ts-pattern';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  private async createAuthToken(userId: number) {
    const authToken = sha('sha256')
      .update(`${Date.now().toString()}:${userId}`)
      .digest('hex');

    const result = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        authToken,
      },
      include: {
        store: true,
      },
    });

    return result;
  }

  async signup(args: z.infer<typeof signupUserZodSchema>) {
    const [emailExistsUser, nicknameExistsUser] = await Promise.all([
      this.prismaService.user.findFirst({
        where: { email: args.email },
      }),
      this.prismaService.user.findFirst({
        where: { nickname: args.nickname },
      }),
    ]);

    if (emailExistsUser !== null) {
      throw new UserEmailAlreadyExistsException();
    }

    if (nicknameExistsUser !== null) {
      throw new UserNicknameAlreadyExistsException();
    }

    const user = await match(args)
      .with({ kind: UserKindEnum.Consumer }, async (_args) => {
        return await this.prismaService.user.create({
          data: {
            email: _args.email,
            nickname: _args.nickname,
            password: await hash(
              _args.password,
              getConfig().PASSWORD_HASH_SALT_ROUND,
            ),
            kind: 'CONSUMER',
          },
          include: {
            store: true,
          },
        });
      })
      .with({ kind: UserKindEnum.Store }, async (_args) => {
        return await this.prismaService.user.create({
          data: {
            email: args.email,
            nickname: args.nickname,
            password: await hash(
              args.password,
              getConfig().PASSWORD_HASH_SALT_ROUND,
            ),
            kind: 'STORE',
            store: {
              create: {
                name: _args.storeName,
                imageUrl: _args.storeImageUrl,
                descrption: _args.storeDescription,
                address: _args.storeAddress,
                storeCategory: _args.storeCategory,
              },
            },
          },
          include: {
            store: true,
          },
        });
      })
      .exhaustive();

    return await this.createAuthToken(user.id);
  }
}
