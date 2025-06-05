import { Router } from 'express';
import { submitRanking, getRankings } from '../controllers/ranking.controller';
import { routeAdapter } from '../adapters/express-route.adapter';

const router = Router();

router.post('/', routeAdapter(submitRanking));
router.get('/', routeAdapter(getRankings));

export default router; 