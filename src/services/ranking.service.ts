import { Ranking, RankingModel } from '../models/ranking.model';
import { PaginatedResult } from '../models/pagination.model';

export const addRanking = async (ranking: Ranking): Promise<Ranking> => {
  return RankingModel.create(ranking);
};

export const listRankings = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResult<Ranking>> => {
  const skip = Math.max(0, (page - 1) * limit - 1);
  
  const [rankings, total] = await Promise.all([
    RankingModel.find()
      .sort({ firstFound: -1, lastFound: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    RankingModel.countDocuments()
  ]);

  return {
    data: rankings,
    total,
    page,
    limit,
    hasMore: total > page
  };
};
