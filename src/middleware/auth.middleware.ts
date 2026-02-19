import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth.service';
import { unauthorized } from '../helpers/httpResponse';
import { env } from '../config/env';

/**
 * Middleware that requires a valid JWT in Authorization: Bearer <token> and sets req.user.
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (!env.JWT_SECRET) {
    res.status(503).json({ error: 'Authentication is not configured' });
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json(unauthorized('Missing or invalid Authorization header').body);
    return;
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json(unauthorized('Invalid or expired token').body);
    return;
  }

  req.user = payload;
  next();
};
