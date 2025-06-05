import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env';
import { serverError, unprocessable, conflict } from '../helpers/httpResponse';

const handleZodError = (err: ZodError) => {
  const errors = err.errors.map(error => error.message);
  return unprocessable(errors);
};

const handleMongoError = (err: any) => {
  if (err.code === 11000) {
    return conflict('Duplicate value found');
  }
  return serverError('Database error occurred');
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', {
    name: err.name,
    message: err.message,
    stack: env.NODE_ENV === 'dev' ? err.stack : undefined
  });

  let response;

  if (err instanceof ZodError) {
    response = handleZodError(err);
  } else if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    response = handleMongoError(err);
  } else {
    response = serverError(
      env.NODE_ENV === 'dev' ? err.message : 'Internal server error',
      err
    );
  }

  return res.status(response.statusCode).json(response.body);
};
