import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CloudflareService } from '../cloudflare/cloudflare.service';

@ApiTags('Images')
@Controller('/api/v1/images')
export class ImageController {
  constructor(private readonly cloudflareService: CloudflareService) {}

  @Get('/image_upload_url')
  async getImageUploadUrl() {
    const url = await this.cloudflareService.getImageUploadUrl();

    return {
      data: {
        url,
      },
    };
  }
}
