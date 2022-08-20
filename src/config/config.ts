import { z } from 'zod';
import { ze } from '~/internal-package/zod-extension';
import * as fs from 'fs';

const configZodSchema = z.object({
  DATABASE_URL: z.string(),
  PASSWORD_HASH_SALT_ROUND: ze.intString().transform(Number),
  SENTRY_DSN: z.string().optional(),
  CLOUDFLARE_IMAGE_ORIGIN: z.string().url(),
  CLOUDFLARE_TOKEN: z.string(),
  CLOUDFLARE_ACCOUNT: z.string(),
  gcpVisionAi: z.object({
    project_id: z.string(),
    private_key: z.string(),
    client_email: z.string(),
  }),
});

let config: z.infer<typeof configZodSchema> | null = null;

export const loadConfig = async () => {
  const result = JSON.parse(fs.readFileSync('./gcp-vision-ai.json').toString());

  config = configZodSchema.parse({
    ...process.env,
    gcpVisionAi: {
      ...result,
    },
  });
};

export const getConfig = (): z.infer<typeof configZodSchema> => {
  if (config === null) {
    throw new Error('config was not loaded');
  }

  return config;
};
