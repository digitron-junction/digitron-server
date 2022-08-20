import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { UserKindEnum } from '~/entity/user.entity';
import {
  UserEmailAlreadyExistsException,
  UserNicknameAlreadyExistsException,
  UserNotfoundException,
  UserNotfoundOrPasswordWrongException,
} from '~/exception/service-exception/user.exception';

import { PrismaService } from '../prisma/prisma.service';
import { signupUserZodSchema } from './user.controller';
import { hash, compare } from 'bcrypt';
import { getConfig } from '~/config/config';
import * as sha from 'sha.js';
import { match } from 'ts-pattern';
import { CloudflareService } from '../cloudflare/cloudflare.service';
import { ImageInvalidException } from '~/exception/service-exception/image.exception';
import { store, user } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudflareService: CloudflareService,
  ) {}

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
        where: { email: args.email, deletedAt: null },
      }),
      this.prismaService.user.findFirst({
        where: { nickname: args.nickname, deletedAt: null },
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
        if (
          _args.storeImageId &&
          !(await this.cloudflareService.validateImageUpload(
            _args.storeImageId,
          ))
        ) {
          throw new ImageInvalidException();
        }

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
                imageId: _args.storeImageId,
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

  async signin({ email, password }: { email: string; password: string }) {
    const user = await this.prismaService.user.findFirst({
      where: { email, deletedAt: null },
    });

    if (user === null) {
      throw new UserNotfoundOrPasswordWrongException();
    }

    const isValid = await compare(password, user.password);

    if (isValid === false) {
      throw new UserNotfoundOrPasswordWrongException();
    }

    return await this.createAuthToken(user.id);
  }

  async getUserById(userId: number) {
    const user = await this.prismaService.user.findFirst({
      where: { id: userId, deletedAt: null },
      include: {
        store: true,
      },
    });

    if (!user) {
      throw new UserNotfoundException();
    }

    return user;
  }

  async getUserByAuthToken(authToken: string) {
    const user = await this.prismaService.user.findFirst({
      where: { authToken, deletedAt: null },
      include: {
        store: true,
      },
    });

    if (!user) {
      throw new UserNotfoundException();
    }

    return user;
  }

  async getUserImage(
    user: user & {
      store: store | null;
    },
  ) {
    if (user.store?.imageId) {
      return await this.cloudflareService.getImageDetailById(
        user.store.imageId,
      );
    }

    return null;
  }
}
