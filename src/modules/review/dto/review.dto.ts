import { review, user } from '@prisma/client';
import { z } from 'zod';

export const reviewZodSchema = z.object({
  id: z.number(),
  content: z.string(),
  writerId: z.number(),
  productId: z.number(),
  rating: z.number(),
  isBuyer: z.boolean(),
  writer: z.object({
    id: z.number(),
    nickname: z.string(),
  }),
});

export const reviewEntityToDto = (review: review & { writer: user }) => {
  return reviewZodSchema.parse(review);
};
