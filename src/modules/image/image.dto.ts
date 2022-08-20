import { z } from 'zod';

export const imageEntityZodSchema = z.object({
  id: z.string(),
  originalUrl: z.string(),
  thumbnailUrl: z.string(),
});
