import { Injectable } from '@nestjs/common';
import { Pool } from 'undici';
import { z } from 'zod';
import { getConfig } from '~/config/config';
import { IImageEntity } from '~/entity/image.entity';
import { ImageInvalidException } from '~/exception/service-exception/image.exception';

const imageUploadUrlResponseZodSchema = z.object({
  result: z.object({
    uploadURL: z.string(),
  }),
});

const imageDraftCheckResponseZodSchema = z.object({
  result: z.object({
    draft: z.boolean().optional(),
  }),
});

const imageDetailResponseZodSchema = z.object({
  result: z.object({
    id: z.string(),
    variants: z.array(z.string()).min(1),
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
    console.log('aa');

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

    return imageUploadUrlResponseZodSchema.parse(await response.body.json())
      .result.uploadURL;
  }

  async validateImageUpload(imageId: string): Promise<boolean> {
    try {
      const response = await this.pool.request({
        method: 'GET',
        path: `/client/v4/accounts/${
          getConfig().CLOUDFLARE_ACCOUNT
        }/images/v1/${imageId}`,
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${getConfig().CLOUDFLARE_TOKEN}`,
        },
      });

      return (
        imageDraftCheckResponseZodSchema.parse(await response.body.json())
          .result.draft !== true
      );
    } catch (error) {
      return false;
    }
  }

  async getImageDetailById(imageId: string): Promise<IImageEntity> {
    const response = await this.pool.request({
      method: 'GET',
      path: `/client/v4/accounts/${
        getConfig().CLOUDFLARE_ACCOUNT
      }/images/v1/${imageId}`,
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${getConfig().CLOUDFLARE_TOKEN}`,
      },
    });

    try {
      const result = imageDetailResponseZodSchema.parse(
        await response.body.json(),
      );

      return {
        id: result.result.id,
        url: result.result.variants[0],
      };
    } catch (error) {
      throw new ImageInvalidException();
    }
  }
}
