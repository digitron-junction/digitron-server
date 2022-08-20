import { ApiProperty } from '@nestjs/swagger';
import { user } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { z } from 'zod';
import { UserKindEnum } from '~/entity/user.entity';

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
  storeImageUrl?: string;

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
  store: z
    .object({
      id: z.number(),
      name: z.string(),
      imageUrl: z.string().nullable(),
      descrption: z.string(),
      address: z.string(),
      storeCategory: z.string(),
    })
    .nullable(),
});

export const userEntityToDto = (user: user) => {
  return userResponseZodSchema.parse(user);
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
  store: z
    .object({
      id: z.number(),
      name: z.string(),
      imageUrl: z.string().nullable(),
      descrption: z.string(),
      address: z.string(),
      storeCategory: z.string(),
    })
    .nullable(),
});

export const otherUserEntityToDto = (user: user) => {
  return otherUserResponseZodSchema.parse(user);
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
