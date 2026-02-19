import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import type { User } from '../models/user.model';
import { env } from '../config/env';

export interface AuthPayload {
  id: string;
  email: string;
  displayName?: string;
}

/**
 * Registers a new user with hashed password.
 */
export const registerUser = async (
  email: string,
  password: string,
  displayName?: string
): Promise<User> => {
  const hash = await Bun.password.hash(password, { algorithm: 'bcrypt', cost: 10 });
  const user = await UserModel.create({ email, password: hash, displayName });
  return user;
};

/**
 * Finds user by email.
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  return UserModel.findOne({ email }).lean();
};

/**
 * Verifies password against hash and returns user payload if valid.
 */
export const verifyCredentials = async (
  email: string,
  password: string
): Promise<AuthPayload | null> => {
  const user = (await UserModel.findOne({ email })) as unknown as User;
  if (!user) return null;
  const valid = await Bun.password.verify(password, user.password, 'bcrypt');
  if (!valid) return null;
  return {
    id: String(user._id),
    email: user.email,
    displayName: user.displayName,
  };
};

/**
 * Signs a JWT for the given payload.
 */
export const signToken = (payload: AuthPayload): string => {
  const secret = env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return jwt.sign(payload, secret, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

/**
 * Verifies JWT and returns payload.
 */
export const verifyToken = (token: string): AuthPayload | null => {
  if (!env.JWT_SECRET) return null;
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    return decoded;
  } catch (err) {
    console.error('Error verifying token:', err);
    return null;
  }
};
