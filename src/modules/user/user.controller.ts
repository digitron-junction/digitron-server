import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { UserKindEnum } from '~/entity/user.entity';
import { InvalidSignUpArgumentException } from '~/exception/service-exception/user.exception';
import { SignUpDto } from './user.dto';
import { UserService } from './user.service';

export const signupUserZodSchema = z.union([
  z.object({
    kind: z.literal(UserKindEnum.Store),
    nickname: z.string(),
    email: z.string(),
    password: z.string(),
    storeImageUrl: z.string().optional().nullable(),
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
        user,
      },
    };
  }
}
