import { Request } from 'express';
import { RankingModel, RankingSchemaZod } from '../models/ranking.model';
import { ok, unprocessable, created, serverError } from '../helpers/httpResponse';
import { rankingListView } from '../views/ranking.view';
import { addRanking, listRankings } from '../services/ranking.service';
import { updateStats } from '../services/stats.service';
import { Controller } from '../adapters/express-route.adapter';

export const submitRanking: Controller = async (req: Request) => {
  const parseResult = RankingSchemaZod.safeParse(req.body);
  if (!parseResult.success) {
    return unprocessable(parseResult.error.errors);
  }

  try {
    const data = parseResult.data;

    const [ranking] = await Promise.all([
      addRanking(new RankingModel(data)),
      updateStats(data.firstFound, data.lastFound)
    ]);

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
        hasMore: result.hasMore
      }
    });
  } catch (error) {
    console.error('Error fetching rankings:', error);
    return serverError('Failed to fetch rankings');
  }
};
