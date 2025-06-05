import { cardStatOpenAPISchema, statsOpenAPISchema, statsQueryOpenAPISchema } from '../schemas/stats.schema'

const cardStatExample = {
  value: {
    value: "🍕",
    count: 42
  }
}

const statsExample = {
  value: {
    mostFirstFound: [{ value: "🍕", count: 42 }, { value: "🍔", count: 35 }],
    leastFirstFound: [{ value: "🍦", count: 5 }, { value: "🍇", count: 7 }],
    mostLastFound: [{ value: "🍣", count: 40 }, { value: "🍩", count: 33 }],
    leastLastFound: [{ value: "🍦", count: 3 }, { value: "🍇", count: 6 }],
    totals: {
      cards: 6,
      firstFinds: 1000,
      lastFinds: 1000
    }
  }
}

const commonQueryParameters = [
  {
    in: 'query',
    name: 'limit',
    schema: { type: 'string' },
    description: 'Number of results to return (max 10)'
  },
  {
    in: 'query',
    name: 'startDate',
    schema: { type: 'string', format: 'date' },
    description: 'Start date for filtering stats'
  },
  {
    in: 'query',
    name: 'endDate',
    schema: { type: 'string', format: 'date' },
    description: 'End date for filtering stats'
  },
  {
    in: 'query',
    name: 'minScore',
    schema: { type: 'string' },
    description: 'Minimum score for filtering stats'
  },
  {
    in: 'query',
    name: 'maxScore',
    schema: { type: 'string' },
    description: 'Maximum score for filtering stats'
  },
  {
    in: 'query',
    name: 'sortBy',
    schema: { type: 'string', enum: ['firstCount', 'lastCount', 'date', 'score'] },
    description: 'Field to sort by'
  },
  {
    in: 'query',
    name: 'sortOrder',
    schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
    description: 'Sort order'
  }
]

const dateQueryParameter = {
  in: 'query',
  name: 'date',
  schema: { type: 'string', format: 'date' },
  description: 'Date to get stats for (defaults to today)'
}

export const statsPaths = {
  '/stats': {
    get: {
      tags: ['Statistics'],
      operationId: 'getStatsOverview',
      summary: 'Get game statistics overview',
      description: 'Retrieve comprehensive statistics about card findings and game totals',
      parameters: commonQueryParameters,
      responses: {
        200: {
          description: 'Game statistics overview',
          content: {
            'application/json': {
              schema: statsOpenAPISchema,
              example: statsExample.value
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
  },
  '/stats/cards/first': {
    get: {
      tags: ['Statistics'],
      operationId: 'getMostFirstFoundCards',
      summary: 'Get most commonly found first cards',
      description: 'Retrieve statistics about which cards are most commonly found first',
      parameters: commonQueryParameters,
      responses: {
        200: {
          description: 'Most commonly found first cards',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: cardStatOpenAPISchema
              },
              example: [cardStatExample.value]
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
  },
  '/stats/cards/first/least': {
    get: {
      tags: ['Statistics'],
      operationId: 'getLeastFirstFoundCards',
      summary: 'Get least commonly found first cards',
      description: 'Retrieve statistics about which cards are least commonly found first',
      parameters: commonQueryParameters,
      responses: {
        200: {
          description: 'Least commonly found first cards',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: cardStatOpenAPISchema
              },
              example: [cardStatExample.value]
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
  },
  '/stats/cards/last': {
    get: {
      tags: ['Statistics'],
      operationId: 'getMostLastFoundCards',
      summary: 'Get most commonly found last cards',
      description: 'Retrieve statistics about which cards are most commonly found last',
      parameters: commonQueryParameters,
      responses: {
        200: {
          description: 'Most commonly found last cards',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: cardStatOpenAPISchema
              },
              example: [cardStatExample.value]
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
  },
  '/stats/cards/last/least': {
    get: {
      tags: ['Statistics'],
      operationId: 'getLeastLastFoundCards',
      summary: 'Get least commonly found last cards',
      description: 'Retrieve statistics about which cards are least commonly found last',
      parameters: commonQueryParameters,
      responses: {
        200: {
          description: 'Least commonly found last cards',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: cardStatOpenAPISchema
              },
              example: [cardStatExample.value]
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
  },
  '/stats/time/daily': {
    get: {
      tags: ['Statistics'],
      operationId: 'getDailyStats',
      summary: 'Get daily statistics',
      description: 'Retrieve statistics for a specific day',
      parameters: [dateQueryParameter],
      responses: {
        200: {
          description: 'Daily statistics',
          content: {
            'application/json': {
              schema: statsOpenAPISchema,
              example: statsExample.value
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
  },
  '/stats/time/weekly': {
    get: {
      tags: ['Statistics'],
      operationId: 'getWeeklyStats',
      summary: 'Get weekly statistics',
      description: 'Retrieve statistics for a specific week',
      parameters: [dateQueryParameter],
      responses: {
        200: {
          description: 'Weekly statistics',
          content: {
            'application/json': {
              schema: statsOpenAPISchema,
              example: statsExample.value
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