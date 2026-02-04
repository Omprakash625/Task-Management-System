import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
}

export interface TokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export interface AppError extends Error {
  status?: number;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
}

export interface TaskQuery {
  page?: string;
  limit?: string;
  status?: string;
  search?: string;
}