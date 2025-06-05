import { rankingOpenAPISchema, rankingResponseOpenAPISchema } from '../schemas/ranking.schema'

const rankingExample = {
  value: {
    name: "John Doe",
    score: 1000,
    firstFound: "🍕",
    lastFound: "🍦",
    createdAt: new Date().toISOString()
  }
}

const rankingsListExample = {
  value: {
    rankings: [rankingExample.value],
    pagination: {
      page: 1,
      limit: 10,
      total: 1,
      hasMore: false
    }
  }
}

export const rankingsPaths = {
  '/rankings': {
    get: {
      tags: ['Rankings'],
      operationId: 'getRankings',
      summary: 'Get rankings list',
      description: 'Retrieve a paginated list of player rankings ordered by score',
      parameters: [
        {
          in: 'query',
          name: 'page',
          schema: { type: 'integer', default: 1 },
          description: 'Page number'
        },
        {
          in: 'query',
          name: 'limit',
          schema: { type: 'integer', default: 10, maximum: 50 },
          description: 'Items per page'
        }
      ],
      responses: {
        200: {
          description: 'List of rankings',
          content: {
            'application/json': {
              schema: rankingResponseOpenAPISchema,
              example: rankingsListExample.value
            }
          }
        },
        422: {
          $ref: '#/components/responses/ValidationError'
        },
        429: {
          $ref: '#/components/responses/TooManyRequests'
        },
        500: {
          $ref: '#/components/responses/ServerError'
        }
      }
    },
    post: {
      tags: ['Rankings'],
      operationId: 'submitRanking',
      summary: 'Submit new ranking',
      description: 'Submit a new player ranking with their game results',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: rankingOpenAPISchema,
            example: rankingExample.value
          }
        }
      },
      responses: {
        201: {
          description: 'Ranking created',
          content: {
            'application/json': {
              schema: rankingOpenAPISchema,
              example: rankingExample.value
            }
          }
        },
        422: {
          $ref: '#/components/responses/ValidationError'
        },
        429: {
          $ref: '#/components/responses/TooManyRequests'
        },
        500: {
          $ref: '#/components/responses/ServerError'
        }
      }
    }
  }
} 