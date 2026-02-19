import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { routeAdapter } from '../adapters/express-route.adapter';

const router = Router();

router.post('/register', routeAdapter(register));
router.post('/login', routeAdapter(login));

export default router;
