import { z } from 'zod';

export const ze = {
  intString: () => z.string().regex(/^\d{0,}$/g),
};
