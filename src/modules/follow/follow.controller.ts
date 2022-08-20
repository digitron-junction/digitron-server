import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { requiredUserHeader } from '~/config/constants';
import { RequiredUserGuard } from '~/guard/required-user.guard';
import { RequiredUserRequest } from '~/types/request';
import { CreateFollowDto } from './dto/create-follow.dto';
import { DeleteFollowDto } from './dto/delete-follow.dto';
import { followEntityToDto } from './dto/follow.dto';
import { FollowService } from './follow.service';

@ApiTags('Follows')
@Controller('/api/v1/follows')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @UseGuards(RequiredUserGuard)
  @ApiHeader(requiredUserHeader)
  @Post()
  async createFollow(
    @Body() dto: CreateFollowDto,
    @Req() req: RequiredUserRequest,
  ) {
    const follow = await this.followService.addFollow({
      followingStoreId: dto.storeId,
      followerId: req.user.id,
    });

    return {
      data: {
        follow: followEntityToDto(follow),
      },
    };
  }

  @UseGuards(RequiredUserGuard)
  @ApiHeader(requiredUserHeader)
  @Delete()
  async deleteFollow(
    @Body() dto: DeleteFollowDto,
    @Req() req: RequiredUserRequest,
  ) {
    const follow = await this.followService.deleteFollow({
      followingStoreId: dto.storeId,
      followerId: req.user.id,
    });

    return {
      data: {
        follow: followEntityToDto(follow),
      },
    };
  }
}
