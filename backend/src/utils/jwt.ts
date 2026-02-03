import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as jwt.Secret;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as jwt.Secret;

const ACCESS_EXPIRY = (process.env.JWT_ACCESS_EXPIRY ?? '15m') as jwt.SignOptions['expiresIn'];
const REFRESH_EXPIRY = (process.env.JWT_REFRESH_EXPIRY ?? '7d') as jwt.SignOptions['expiresIn'];

export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
};

export const getRefreshTokenExpiry = (): Date => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  return expiry;
};
