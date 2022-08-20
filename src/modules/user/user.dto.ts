import { ApiProperty } from '@nestjs/swagger';
import { store, user, UserKind } from '@prisma/client';
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
import { CloudflareService } from '../cloudflare/cloudflare.service';
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

export const storeZodSchema = z.object({
  id: z.number(),
  name: z.string(),
  descrption: z.string(),
  address: z.string(),
  storeCategory: z.string(),
  image: imageEntityZodSchema.optional().nullable().default(null),
});

const userResponseZodSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  email: z.string(),
  createdAt: z.date(),
  kind: z.nativeEnum(UserKind).transform(dbUserKindToDto),
  store: storeZodSchema.nullable().optional().default(null),
});

export const userEntityToDto = (
  user: any,
  attach?: { storeImage?: IImageEntity },
) => {
  return userResponseZodSchema.parse({
    ...user,
    store: user.store
      ? {
          ...user.store,
          image: attach?.storeImage,
        }
      : null,
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
  store: storeZodSchema.nullable(),
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

export const storeToDto = async (
  store: store,
  services: { cloudflareService: CloudflareService },
) => {
  const image = store.imageId
    ? await services.cloudflareService.getImageDetailById(store.imageId)
    : null;

  return storeZodSchema.parse({ ...store, image });
};
