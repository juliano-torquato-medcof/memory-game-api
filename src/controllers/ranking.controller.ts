import type { Request } from 'express';
import { RankingModel, RankingSchemaZod } from '../models/ranking.model';
import { ok, unprocessable, created, serverError } from '../helpers/httpResponse';
import { rankingListView } from '../views/ranking.view';
import { addRanking, listRankings } from '../services/ranking.service';
import { updateStats } from '../services/stats.service';
import type { Controller } from '../adapters/express-route.adapter';

export const submitRanking: Controller = async (req: Request) => {
  try {
    if (!req.user) throw new Error('Authentication required');
    const parseResult = RankingSchemaZod.safeParse(req.body);
    if (!parseResult.success) {
      throw new Error('Invalid ranking data');
    }

    const data = parseResult.data;
    const name = data.name ?? req.user.displayName ?? req.user.email;
    const rankingData = {
      name,
      score: data.score,
      firstFound: data.firstFound,
      lastFound: data.lastFound,
      userId: req.user.id,
    };

    const [ranking] = await Promise.all([
      addRanking(new RankingModel(rankingData)),
      updateStats(data.firstFound, data.lastFound),
    ]).catch(() => {
      throw new Error('Failed to update stats');
    });

    return created(rankingListView([ranking])[0]);
  } catch (error) {
    console.error('Error submitting ranking:', error);
    return serverError('Failed to submit ranking');
  }
};

export const getRankings: Controller = async (req: Request) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

    const result = await listRankings(page, limit);
    return ok({
      rankings: rankingListView(result.data),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        hasMore: result.hasMore,
      },
    });
  } catch (error) {
    console.error('Error fetching rankings:', error);
    return serverError('Failed to fetch rankings');
  }
};
