import { z } from 'zod'
import { generateSchema, extendZodWithOpenApi } from '@anatine/zod-openapi'

extendZodWithOpenApi(z)

export const errorSchema = z.object({
  error: z.string().describe('Error message'),
  details: z.array(z.object({
    code: z.string().describe('Error code'),
    message: z.string().describe('Detailed error message'),
    path: z.array(z.string()).optional().describe('Path to the error in the request')
  })).optional().describe('Additional error details')
})

export const paginationSchema = z.object({
  page: z.number().int().positive().describe('Current page number'),
  limit: z.number().int().positive().describe('Items per page'),
  total: z.number().int().nonnegative().describe('Total number of items'),
  hasMore: z.boolean().describe('Whether there are more items available')
})

export const errorOpenAPISchema = generateSchema(errorSchema)
export const paginationOpenAPISchema = generateSchema(paginationSchema)

export const examples = {
  validationError: {
    value: {
      error: 'Validation failed',
      details: [
        {
          code: 'invalid_type',
          message: 'Expected string, received number',
          path: ['playerName']
        }
      ]
    }
  },
  serverError: {
    value: {
      error: 'Internal server error',
      details: [
        {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred'
        }
      ]
    }
  }
} 