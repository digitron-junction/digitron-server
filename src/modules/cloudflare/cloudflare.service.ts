import { Injectable } from '@nestjs/common';
import { Pool } from 'undici';
import { z } from 'zod';
import { getConfig } from '~/config/config';
import { IImageEntity } from '~/entity/image.entity';

const imgaeUploadUrlResponseZodSchema = z.object({
  result: z.object({
    uploadURL: z.string(),
  }),
});

@Injectable()
export class CloudflareService {
  private readonly pool: Pool;
  constructor() {
    this.pool = new Pool(getConfig().CLOUDFLARE_IMAGE_ORIGIN, {
      connections: 10,
      keepAliveTimeout: 5000,
      keepAliveMaxTimeout: 5000,
    });
  }

  async getImageUploadUrl(): Promise<string> {
    const response = await this.pool.request({
      method: 'POST',
      path: `/client/v4/accounts/${
        getConfig().CLOUDFLARE_ACCOUNT
      }/images/v2/direct_upload`,
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${getConfig().CLOUDFLARE_TOKEN}`,
      },
    });

    return imgaeUploadUrlResponseZodSchema.parse(await response.body.json())
      .result.uploadURL;
  }

  async validateImageUpload(): Promise<boolean> {
    return true;
  }

  async getImageDetail(): Promise<IImageEntity> {
    return {
      id: '',
      originalUrl: '',
      thumbnailUrl: '',
    };
  }
}
