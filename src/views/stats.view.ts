import { z } from 'zod';
import { StatsOverview } from '../models/stats.model';

const statsQuerySchema = z.object({
  limit: z.string().optional().transform(val => {
    const num = val ? parseInt(val, 10) : 5;
    return Math.min(10, Math.max(1, num));
  }),
  startDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  minScore: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
  maxScore: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
  sortBy: z.enum(['firstCount', 'lastCount', 'date', 'score']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
});

export type StatsQuery = z.infer<typeof statsQuerySchema>;

export const parseStatsQuery = (query: unknown) => {
  return statsQuerySchema.parse(query);
};

export const statsView = (stats: StatsOverview) => {
  return {
    mostFirstFound: stats.mostFirstFound.map(stat => ({
      value: stat.value,
      count: stat.firstCount
    })),
    leastFirstFound: stats.leastFirstFound.map(stat => ({
      value: stat.value,
      count: stat.firstCount
    })),
    mostLastFound: stats.mostLastFound.map(stat => ({
      value: stat.value,
      count: stat.lastCount
    })),
    leastLastFound: stats.leastLastFound.map(stat => ({
      value: stat.value,
      count: stat.lastCount
    })),
    totals: {
      cards: stats.totalCards,
      firstFinds: stats.totalFirstFinds,
      lastFinds: stats.totalLastFinds
    }
  };
}; 