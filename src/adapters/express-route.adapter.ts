import { Request, Response, NextFunction, RequestHandler } from 'express';
import { IHttpResponse } from '../helpers/httpResponse';

export type Controller = (request: Request) => Promise<IHttpResponse>;

export const routeAdapter = (controller: Controller): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const httpResponse = await controller(req);

      if (httpResponse.headers) {
        res.set(httpResponse.headers);
      }

      res.status(httpResponse.statusCode).json(httpResponse.body);
    } catch (error) {
      console.error('Route error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Internal server error' 
      });
    }
  };
}; 