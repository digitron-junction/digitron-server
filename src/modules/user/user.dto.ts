import { ApiProperty } from '@nestjs/swagger';
import { user, UserKind } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { match } from 'ts-pattern';
import { z } from 'zod';
import { IImageEntity } from '~/entity/image.entity';
import { UserKindEnum } from '~/entity/user.entity';
import { imageEntityZodSchema } from '../image/image.dto';

const dbUserKindToDto = (kind: UserKind) => {
  return match(kind)
    .with(UserKind.CONSUMER, () => UserKindEnum.Consumer)
    .with(UserKind.STORE, () => UserKindEnum.Store)
    .exhaustive();
};

export class SignUpDto {
  @ApiProperty({
    name: 'nickname',
    description: 'nickname of user',
    required: true,
  })
  @IsString()
  nickname!: string;

  @ApiProperty({
    required: true,
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    type: UserKindEnum,
    enum: UserKindEnum,
    required: true,
    description: 'is store or consumer',
  })
  @IsEnum(UserKindEnum)
  kind!: UserKindEnum;

  @ApiProperty({
    description: 'password',
    required: true,
  })
  @IsString()
  password!: string;

  @ApiProperty({
    required: false,
    description: '(only at store account)',
  })
  @IsOptional()
  @IsString()
  storeImageId?: string;

  @ApiProperty({
    required: false,
    description: 'name of store(only at store account)',
  })
  @IsOptional()
  @IsString()
  storeName!: string;

  @ApiProperty({
    required: false,
    description: 'description of store(only at store account)',
  })
  @IsOptional()
  @IsString()
  storeDescription!: string;

  @ApiProperty({
    required: false,
    description: 'address of store(only at store account)',
  })
  @IsOptional()
  @IsString()
  storeAddress!: string;

  @ApiProperty({
    required: false,
    description: 'category of store(only at store account)',
  })
  @IsOptional()
  @IsString()
  storeCategory!: string;
}

export class SigninDto {
  @ApiProperty({
    description: "user's email",
    required: true,
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: "user's password",
    required: true,
  })
  @IsString()
  password!: string;
}

const userResponseZodSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  email: z.string(),
  createdAt: z.date(),
  kind: z.nativeEnum(UserKind).transform(dbUserKindToDto),
  store: z
    .object({
      id: z.number(),
      name: z.string(),
      descrption: z.string(),
      address: z.string(),
      storeCategory: z.string(),
      image: imageEntityZodSchema.optional().nullable().default(null),
    })
    .nullable(),
});

export const userEntityToDto = (
  user: any,
  attach?: { storeImage?: IImageEntity },
) => {
  return userResponseZodSchema.parse({
    ...user,
    store: {
      ...user.store,
      image: attach?.storeImage,
    },
  });
};

const authTokenReponseZodSchema = z.object({
  authToken: z.string(),
});

export const authTokenToDto = (user: user) => {
  return authTokenReponseZodSchema.parse(user);
};

const otherUserResponseZodSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  createdAt: z.date(),
  kind: z.nativeEnum(UserKind).transform(dbUserKindToDto),
  store: z
    .object({
      id: z.number(),
      name: z.string(),
      descrption: z.string(),
      address: z.string(),
      storeCategory: z.string(),
      image: imageEntityZodSchema.optional().nullable().default(null),
    })
    .nullable(),
});

export const otherUserEntityToDto = (
  user: any,
  attach?: { storeImage?: IImageEntity },
) => {
  return otherUserResponseZodSchema.parse({
    ...user,
    store: {
      ...user.store,
      image: attach?.storeImage,
    },
  });
};

export class GetOneUserDto {
  @ApiProperty({
    description: 'user Id',
    required: true,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  userId!: number;
}
