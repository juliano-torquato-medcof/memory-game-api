import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { env } from '../config/env';

export const corsMiddleware = cors({
  origin: true,
  methods: ['GET', 'POST'],
  credentials: true
});

export const sanitizeRequest = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (key.startsWith('$')) {
        delete req.body[key];
      }
    });
  }
  next();
};

export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
};
