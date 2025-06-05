import { z } from 'zod';

export const PaginatedResultSchema = z.object({
  data: z.array(z.any()),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  hasMore: z.boolean()
});

export type PaginatedResult<T> = z.infer<typeof PaginatedResultSchema> & { data: T[] }; 