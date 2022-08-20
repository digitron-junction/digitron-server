import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { z } from 'zod';

export const imageEntityZodSchema = z.object({
  id: z.string(),
  url: z.string(),
});

export class GetImageDetailDto {
  @ApiProperty({
    required: true,
    type: String,
    description: 'image id',
  })
  @IsString()
  imageId!: string;
}
