import { Ranking } from '../models/ranking.model';

export const rankingView = (ranking: Ranking) => ({
  name: ranking.name,
  score: ranking.score,
  createdAt: ranking.createdAt,
});

export const rankingListView = (rankings: Ranking[]) => rankings.map(rankingView); 