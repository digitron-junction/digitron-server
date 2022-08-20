import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
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
