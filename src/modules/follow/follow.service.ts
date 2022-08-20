import { Injectable } from '@nestjs/common';
import { NoFollowException } from '~/exception/service-exception/follow.exception';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FollowService {
  constructor(private readonly prismaService: PrismaService) {}

  async addFollow({
    followerId,
    followingStoreId,
  }: {
    followerId: number;
    followingStoreId: number;
  }) {
    const follow = await this.prismaService.follow.upsert({
      where: {
        followingStoreId_followerId: {
          followerId,
          followingStoreId,
        },
      },
      update: {},
      create: {
        followerId,
        followingStoreId,
      },
      include: {
        followingStore: true,
      },
    });

    return follow;
  }

  async deleteFollow({
    followerId,
    followingStoreId,
  }: {
    followerId: number;
    followingStoreId: number;
  }) {
    const preFollow = await this.prismaService.follow.findUnique({
      where: {
        followingStoreId_followerId: {
          followerId,
          followingStoreId,
        },
      },
    });

    if (preFollow === null) {
      throw new NoFollowException();
    }

    const follow = await this.prismaService.follow.delete({
      where: {
        followingStoreId_followerId: {
          followerId,
          followingStoreId,
        },
      },
      include: {
        followingStore: true,
      },
    });

    return follow;
  }

  async getFollowerCountByStoreId(storeId: number) {
    return await this.prismaService.follow.count({
      where: {
        followingStoreId: storeId,
      },
    });
  }
}
