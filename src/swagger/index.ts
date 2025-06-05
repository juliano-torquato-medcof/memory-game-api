import { rankingsPaths } from './paths/rankings.paths'
import { statsPaths } from './paths/stats.paths'
import { rankingOpenAPISchema, rankingResponseOpenAPISchema } from './schemas/ranking.schema'
import { statsOpenAPISchema } from './schemas/stats.schema'
import { errorOpenAPISchema, paginationOpenAPISchema } from './schemas/common.schema'
import { env } from '../config/env'

const getServerUrl = () => {
  if (env.NODE_ENV === 'prod') {
    return env.API_URL
  }
  return `${env.API_URL}:${env.PORT}`
}

export const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Memory Game API',
    version: '1.0.0',
    description: `
API documentation for the Memory Game backend service.

## Rate Limiting
- 100 requests per minute per IP
- Endpoints return 429 Too Many Requests when limit is exceeded

## CORS
- Allowed methods: GET, POST
- Allowed headers: Content-Type, Authorization

## Error Handling
All error responses follow a standard format with an error message and optional details.
    `
  },
  servers: [
    {
      url: getServerUrl(),
      description: `${env.NODE_ENV} server`
    }
  ],
  tags: [
    {
      name: 'Rankings',
      description: 'Player rankings and scores'
    },
    {
      name: 'Statistics',
      description: 'Game statistics including card findings and time-based analytics'
    }
  ],
  components: {
    schemas: {
      Ranking: rankingOpenAPISchema,
      RankingResponse: rankingResponseOpenAPISchema,
      Stats: statsOpenAPISchema,
      Error: errorOpenAPISchema,
      Pagination: paginationOpenAPISchema
    },
    responses: {
      ValidationError: {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      },
      ServerError: {
        description: 'Server error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      },
      TooManyRequests: {
        description: 'Too many requests',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      }
    }
  },
  paths: {
    ...rankingsPaths,
    ...statsPaths
  }
} as const 