import { Request } from 'express';
import { 
  mostFirstFound, 
  leastFirstFound, 
  mostLastFound, 
  leastLastFound,
  getStatsOverview,
  getDailyStats,
  getWeeklyStats
} from '../services/stats.service';
import { ok, serverError, unprocessable } from '../helpers/httpResponse';
import { Controller } from '../adapters/express-route.adapter';
import { z } from 'zod';
import { parseStatsQuery, statsView } from '../views/stats.view';

export const getMostFirstFound: Controller = async (req: Request) => {
  try {
    const query = parseStatsQuery(req.query);
    const stats = await mostFirstFound(query);
    return ok(stats.map(stat => ({ value: stat.value, count: stat.firstCount })));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return unprocessable(error.errors);
    }
    console.error('Error getting most first found:', error);
    return serverError('Failed to get stats');
  }
};

export const getLeastFirstFound: Controller = async (req: Request) => {
  try {
    const query = parseStatsQuery(req.query);
    const stats = await leastFirstFound(query);
    return ok(stats.map(stat => ({ value: stat.value, count: stat.firstCount })));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return unprocessable(error.errors);
    }
    console.error('Error getting least first found:', error);
    return serverError('Failed to get stats');
  }
};

export const getMostLastFound: Controller = async (req: Request) => {
  try {
    const query = parseStatsQuery(req.query);
    const stats = await mostLastFound(query);
    return ok(stats.map(stat => ({ value: stat.value, count: stat.lastCount })));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return unprocessable(error.errors);
    }
    console.error('Error getting most last found:', error);
    return serverError('Failed to get stats');
  }
};

export const getLeastLastFound: Controller = async (req: Request) => {
  try {
    const query = parseStatsQuery(req.query);
    const stats = await leastLastFound(query);
    return ok(stats.map(stat => ({ value: stat.value, count: stat.lastCount })));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return unprocessable(error.errors);
    }
    console.error('Error getting least last found:', error);
    return serverError('Failed to get stats');
  }
};

export const getStats: Controller = async (req: Request) => {
  try {
    const query = parseStatsQuery(req.query);
    const stats = await getStatsOverview(query);
    return ok(statsView(stats));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return unprocessable(error.errors);
    }
    console.error('Error getting stats overview:', error);
    return serverError('Failed to get stats overview');
  }
};

export const getDailyStatsHandler: Controller = async (req: Request) => {
  try {
    const date = req.query.date ? new Date(req.query.date as string) : new Date();
    const stats = await getDailyStats(date);
    return ok(statsView(stats));
  } catch (error) {
    console.error('Error getting daily stats:', error);
    return serverError('Failed to get daily stats');
  }
};

export const getWeeklyStatsHandler: Controller = async (req: Request) => {
  try {
    const date = req.query.date ? new Date(req.query.date as string) : new Date();
    const stats = await getWeeklyStats(date);
    return ok(statsView(stats));
  } catch (error) {
    console.error('Error getting weekly stats:', error);
    return serverError('Failed to get weekly stats');
  }
}; 