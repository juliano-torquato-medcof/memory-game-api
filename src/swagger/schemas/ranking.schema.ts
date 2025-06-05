import { z } from 'zod'
import { generateSchema } from '@anatine/zod-openapi'
import { extendZodWithOpenApi } from '@anatine/zod-openapi'

extendZodWithOpenApi(z)

export const rankingSchema = z.object({
  name: z.string().describe('Name of the player'),
  score: z.number().int().positive().describe('Time taken to complete the game in seconds'),
  firstFound: z.string().describe('First card found in the game'),
  lastFound: z.string().describe('Last card found in the game'),
  createdAt: z.string().datetime().optional().describe('When the ranking was created')
})

export const rankingResponseSchema = z.object({
  rankings: z.array(rankingSchema),
  pagination: z.object({
    total: z.number().int(),
    page: z.number().int(),
    limit: z.number().int(),
    hasMore: z.boolean()
  })
})

export const rankingOpenAPISchema = generateSchema(rankingSchema)
export const rankingResponseOpenAPISchema = generateSchema(rankingResponseSchema) 