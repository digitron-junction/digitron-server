import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { optionalUserHeader, requiredUserHeader } from '~/config/constants';
import { UserKindEnum } from '~/entity/user.entity';
import { InvalidSignUpArgumentException } from '~/exception/service-exception/user.exception';
import { OptionalUserGuard } from '~/guard/optional-user.guard';
import { RequiredUserGuard } from '~/guard/required-user.guard';
import { OptionalUserRequest, RequiredUserRequest } from '~/types/request';
import {
  authTokenToDto,
  GetOneUserDto,
  otherUserEntityToDto,
  SigninDto,
  SignUpDto,
  userEntityToDto,
} from './user.dto';
import { UserService } from './user.service';

export const signupUserZodSchema = z.union([
  z.object({
    kind: z.literal(UserKindEnum.Store),
    nickname: z.string(),
    email: z.string(),
    password: z.string(),
    storeImageId: z.string().optional().nullable(),
    storeName: z.string(),
    storeDescription: z.string(),
    storeAddress: z.string(),
    storeCategory: z.string(),
  }),
  z.object({
    kind: z.literal(UserKindEnum.Consumer),
    nickname: z.string(),
    email: z.string(),
    password: z.string(),
  }),
]);

@ApiTags('User API')
@Controller('/api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'sign up',
  })
  @Post('/signup')
  async signUp(@Body() dto: SignUpDto) {
    const parsedDtoResult = signupUserZodSchema.safeParse(dto);
    if (parsedDtoResult.success === false) {
      throw new InvalidSignUpArgumentException();
    }
    const parsedDto = parsedDtoResult.data;

    const user = await this.userService.signup(parsedDto);

    return {
      data: {
        user: userEntityToDto(user, {
          storeImage: (await this.userService.getUserImage(user)) ?? undefined,
        }),
        authToken: authTokenToDto(user),
      },
    };
  }

  @Put('/signin')
  async signin(@Body() dto: SigninDto) {
    const user = await this.userService.signin(dto);
    return {
      data: {
        user: userEntityToDto(user, {
          storeImage: (await this.userService.getUserImage(user)) ?? undefined,
        }),
        authToken: authTokenToDto(user),
      },
    };
  }

  @UseGuards(RequiredUserGuard)
  @ApiOperation({
    summary: 'get user by auth token',
  })
  @ApiHeader(requiredUserHeader)
  @Get('/me')
  async getMe(@Req() req: RequiredUserRequest) {
    return {
      data: {
        user: userEntityToDto(req.user, {
          storeImage:
            (await this.userService.getUserImage(req.user)) ?? undefined,
        }),
      },
    };
  }

  @UseGuards(OptionalUserGuard)
  @ApiOperation({
    summary: 'get one user',
  })
  @ApiHeader(optionalUserHeader)
  @Get('/:userId')
  async getOneUser(
    @Param() { userId }: GetOneUserDto,
    @Req() req: OptionalUserRequest,
  ) {
    const user = await this.userService.getUserById(userId);

    return {
      data: {
        user:
          req.user?.id === user.id
            ? userEntityToDto(user, {
                storeImage:
                  (await this.userService.getUserImage(user)) ?? undefined,
              })
            : otherUserEntityToDto(user, {
                storeImage:
                  (await this.userService.getUserImage(user)) ?? undefined,
              }),
      },
    };
  }
}
