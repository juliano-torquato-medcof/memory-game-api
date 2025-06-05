import { Router } from 'express';
import {
  getMostFirstFound,
  getLeastFirstFound,
  getMostLastFound,
  getLeastLastFound,
  getStats,
  getDailyStatsHandler,
  getWeeklyStatsHandler
} from '../controllers/stats.controller';
import { routeAdapter } from '../adapters/express-route.adapter';

const router = Router();

router.get('/', routeAdapter(getStats));
router.get('/first-found/most', routeAdapter(getMostFirstFound));
router.get('/first-found/least', routeAdapter(getLeastFirstFound));
router.get('/last-found/most', routeAdapter(getMostLastFound));
router.get('/last-found/least', routeAdapter(getLeastLastFound));
router.get('/daily', routeAdapter(getDailyStatsHandler));
router.get('/weekly', routeAdapter(getWeeklyStatsHandler));

export default router;
