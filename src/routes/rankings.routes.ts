import { Router } from 'express';
import { submitRanking, getRankings } from '../controllers/ranking.controller';
import { routeAdapter } from '../adapters/express-route.adapter';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/', requireAuth, routeAdapter(submitRanking));
router.get('/', routeAdapter(getRankings));

export default router; 