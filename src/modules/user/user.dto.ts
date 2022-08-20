import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
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
  @IsString()
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
