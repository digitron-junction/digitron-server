import { follow, store } from '@prisma/client';
import { z } from 'zod';

export const followZodSchema = z.object({
  followerId: z.number(),
  followingStoreId: z.number(),
  followingStore: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

export const followEntityToDto = (
  follow: follow & {
    followingStore: store;
  },
) => {
  return followZodSchema.parse(follow);
};
