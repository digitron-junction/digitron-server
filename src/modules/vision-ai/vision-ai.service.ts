import { Injectable } from '@nestjs/common';
import * as vision from '@google-cloud/vision';
import { getConfig } from '~/config/config';
import { IImageAiMetadataEntity } from '~/entity/image-metadata.entity';
import { Agent, fetch } from 'undici';

@Injectable()
export class VisionAiService {
  private readonly client: vision.ImageAnnotatorClient;
  constructor() {
    this.client = new vision.ImageAnnotatorClient({
      projectId: 'towneerss',
      credentials: {
        private_key: getConfig().gcpVisionAi.private_key,
        client_email: getConfig().gcpVisionAi.client_email,
      },
    });
  }

  async getImageMetadata(imageUrl: string): Promise<IImageAiMetadataEntity> {
    const fetchResult = await fetch(imageUrl, {
      dispatcher: new Agent({
        keepAliveTimeout: 10,
        keepAliveMaxTimeout: 10,
      }),
    });

    const arrayBuffer = await fetchResult.arrayBuffer();

    const base64Image = Buffer.from(arrayBuffer).toString('base64');

    const [response] = await this.client.annotateImage({
      image: {
        content: base64Image,
      },
      features: [
        {
          type: 'LABEL_DETECTION',
        },
      ],
    });

    return {
      labels:
        response.labelAnnotations?.map((labelAnnotation) => ({
          description: labelAnnotation.description ?? '',
          score: labelAnnotation.score ?? 0,
        })) ?? [],
    };
  }
}
