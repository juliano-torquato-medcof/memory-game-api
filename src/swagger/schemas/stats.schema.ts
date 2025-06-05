import { z } from 'zod'
import { generateSchema, extendZodWithOpenApi } from '@anatine/zod-openapi'

extendZodWithOpenApi(z)

export const statsQuerySchema = z.object({
  limit: z.string().optional().describe('Number of results to return (max 10)'),
  startDate: z.string().optional().describe('Start date for filtering stats'),
  endDate: z.string().optional().describe('End date for filtering stats'),
  minScore: z.string().optional().describe('Minimum score for filtering stats'),
  maxScore: z.string().optional().describe('Maximum score for filtering stats'),
  sortBy: z.enum(['firstCount', 'lastCount', 'date', 'score']).optional().describe('Field to sort by'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc').describe('Sort order')
})

export const cardStatSchema = z.object({
  value: z.string().describe('Card value'),
  count: z.number().describe('Number of times this card was found')
})

export const statsSchema = z.object({
  mostFirstFound: z.array(cardStatSchema).describe('Most commonly found first cards'),
  leastFirstFound: z.array(cardStatSchema).describe('Least commonly found first cards'),
  mostLastFound: z.array(cardStatSchema).describe('Most commonly found last cards'),
  leastLastFound: z.array(cardStatSchema).describe('Least commonly found last cards'),
  totals: z.object({
    cards: z.number().describe('Total number of unique cards'),
    firstFinds: z.number().describe('Total number of first finds'),
    lastFinds: z.number().describe('Total number of last finds')
  })
})

export const statsQueryOpenAPISchema = generateSchema(statsQuerySchema)
export const cardStatOpenAPISchema = generateSchema(cardStatSchema)
export const statsOpenAPISchema = generateSchema(statsSchema) 