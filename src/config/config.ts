import { z } from 'zod';
import { ze } from '~/internal-package/zod-extension';

const configZodSchema = z.object({
  DATABASE_URL: z.string(),
  PASSWORD_HASH_SALT_ROUND: ze.intString().transform(Number),
});

let config: z.infer<typeof configZodSchema> | null = null;

export const loadConfig = async () => {
  config = configZodSchema.parse({
    ...process.env,
  });
};

export const getConfig = (): z.infer<typeof configZodSchema> => {
  if (config === null) {
    throw new Error('config was not loaded');
  }

  return config;
};
