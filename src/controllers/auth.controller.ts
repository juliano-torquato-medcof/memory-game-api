import type { Request } from 'express';
import { UserSchemaZod, type User } from '../models/user.model';
import {
  registerUser,
  findUserByEmail,
  verifyCredentials,
  signToken,
} from '../services/auth.service';
import {
  created,
  badRequest,
  unauthorized,
  conflict,
  serverError,
  ok,
} from '../helpers/httpResponse';
import type { Controller } from '../adapters/express-route.adapter';
import { env } from '../config/env';

/**
 * Registers a new user and returns a JWT.
 */
export const register: Controller = async (req: Request) => {
  if (!env.JWT_SECRET) {
    return serverError('Authentication is not configured');
  }

  const parseResult = UserSchemaZod.safeParse(req.body);
  if (!parseResult.success) {
    return badRequest(parseResult.error.errors);
  }

  const { email, password, displayName } = parseResult.data;

  const existing = await findUserByEmail(email);
  if (existing) {
    return conflict('Email already registered');
  }

  try {
    const user = (await registerUser(email, password, displayName)) as User;
    const id = String(user._id);
    const token = signToken({
      id,
      email: user.email,
      displayName: user.displayName,
    });
    return created({
      token,
      user: {
        id,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return serverError('Failed to register');
  }
};

const LoginSchemaZod = UserSchemaZod.pick({ email: true, password: true });

/**
 * Authenticates user and returns a JWT.
 */
export const login: Controller = async (req: Request) => {
  if (!env.JWT_SECRET) {
    return serverError('Authentication is not configured');
  }

  const parseResult = LoginSchemaZod.safeParse(req.body);
  if (!parseResult.success) {
    return badRequest(parseResult.error.errors);
  }

  const { email, password } = parseResult.data;
  const payload = await verifyCredentials(email, password);
  if (!payload) {
    return unauthorized('Invalid email or password');
  }

  const token = signToken(payload);
  return ok({
    token,
    user: {
      id: payload.id,
      email: payload.email,
      displayName: payload.displayName,
    },
  });
};
