import { StatsModel, StatsOverview } from '../models/stats.model';
import { StatsQuery } from '../views/stats.view';
import { SortOrder } from 'mongoose';

const DEFAULT_LIMIT = 5;

export const updateStats = async (firstFound: string, lastFound: string): Promise<void> => {
  await StatsModel.bulkWrite([
    {
      updateOne: {
        filter: { value: firstFound },
        update: { $inc: { firstCount: 1 } },
        upsert: true
      }
    },
    {
      updateOne: {
        filter: { value: lastFound },
        update: { $inc: { lastCount: 1 } },
        upsert: true
      }
    }
  ]);
};

const buildQuery = (query: Partial<StatsQuery>) => {
  const filter: Record<string, any> = {};
  
  if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) filter.createdAt.$gte = query.startDate;
    if (query.endDate) filter.createdAt.$lte = query.endDate;
  }

  if (query.minScore || query.maxScore) {
    const scoreField = query.sortBy === 'lastCount' ? 'lastCount' : 'firstCount';
    filter[scoreField] = {};
    if (query.minScore) filter[scoreField].$gte = query.minScore;
    if (query.maxScore) filter[scoreField].$lte = query.maxScore;
  }

  return filter;
};

const getSortOptions = (query: Partial<StatsQuery>): Record<string, SortOrder> => {
  const sortOrder: SortOrder = query.sortOrder === 'asc' ? 1 : -1;
  switch (query.sortBy) {
    case 'lastCount':
      return { lastCount: sortOrder };
    case 'date':
      return { createdAt: sortOrder };
    case 'score':
      return { firstCount: sortOrder, lastCount: sortOrder };
    default:
      return { firstCount: sortOrder };
  }
};

export const mostFirstFound = async (query: Partial<StatsQuery> = {}) => {
  const filter = buildQuery(query);
  const sort = getSortOptions(query);
  return StatsModel.find(filter)
    .select('value firstCount -_id')
    .sort(sort)
    .limit(query.limit || DEFAULT_LIMIT)
    .lean();
};

export const leastFirstFound = async (query: Partial<StatsQuery> = {}) => {
  const filter = buildQuery(query);
  const sort = { firstCount: 1 as SortOrder };
  return StatsModel.find(filter)
    .select('value firstCount -_id')
    .sort(sort)
    .limit(query.limit || DEFAULT_LIMIT)
    .lean();
};

export const mostLastFound = async (query: Partial<StatsQuery> = {}) => {
  const filter = buildQuery(query);
  const sort = { lastCount: -1 as SortOrder };
  return StatsModel.find(filter)
    .select('value lastCount -_id')
    .sort(sort)
    .limit(query.limit || DEFAULT_LIMIT)
    .lean();
};

export const leastLastFound = async (query: Partial<StatsQuery> = {}) => {
  const filter = buildQuery(query);
  const sort = { lastCount: 1 as SortOrder };
  return StatsModel.find(filter)
    .select('value lastCount -_id')
    .sort(sort)
    .limit(query.limit || DEFAULT_LIMIT)
    .lean();
};

export const getStatsOverview = async (query: Partial<StatsQuery> = {}): Promise<StatsOverview> => {
  const filter = buildQuery(query);
  const [
    mostFirstFoundResults,
    leastFirstFoundResults,
    mostLastFoundResults,
    leastLastFoundResults,
    aggregateStats
  ] = await Promise.all([
    mostFirstFound(query),
    leastFirstFound(query),
    mostLastFound(query),
    leastLastFound(query),
    StatsModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalCards: { $sum: 1 },
          totalFirstFinds: { $sum: '$firstCount' },
          totalLastFinds: { $sum: '$lastCount' }
        }
      }
    ])
  ]);

  const stats = aggregateStats[0] || { totalCards: 0, totalFirstFinds: 0, totalLastFinds: 0 };

  return {
    mostFirstFound: mostFirstFoundResults,
    leastFirstFound: leastFirstFoundResults,
    mostLastFound: mostLastFoundResults,
    leastLastFound: leastLastFoundResults,
    totalCards: stats.totalCards,
    totalFirstFinds: stats.totalFirstFinds,
    totalLastFinds: stats.totalLastFinds
  };
};

export const getDailyStats = async (date: Date = new Date()) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return getStatsOverview({
    startDate: startOfDay,
    endDate: endOfDay
  });
};

export const getWeeklyStats = async (date: Date = new Date()) => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return getStatsOverview({
    startDate: startOfWeek,
    endDate: endOfWeek
  });
};
