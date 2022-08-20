import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CloudflareService } from '../cloudflare/cloudflare.service';
import { GetImageDetailDto } from './image.dto';

@ApiTags('Images')
@Controller('/api/v1/images')
export class ImageController {
  constructor(private readonly cloudflareService: CloudflareService) {}

  @ApiOperation({
    summary: 'get image upload url',
  })
  @Get('/image_upload_url')
  async getImageUploadUrl() {
    const url = await this.cloudflareService.getImageUploadUrl();

    return {
      data: {
        url,
      },
    };
  }

  @ApiOperation({
    summary: 'get image detail',
  })
  @Get('/:imageId')
  async getImageDetail(@Param() { imageId }: GetImageDetailDto) {
    const imageDetail = await this.cloudflareService.getImageDetailById(
      imageId,
    );

    return {
      data: {
        imageDetail,
      },
    };
  }
}
