import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../config/database';
import { success, fail } from '../utils/api-response';

import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken,
  getRefreshTokenExpiry 
} from '../utils/jwt';
import { AuthRequest, RegisterInput, LoginInput } from '../types';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body as RegisterInput;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return fail(res, 'User already exists with this email', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry()
      }
    });

    return success(res, { user, accessToken, refreshToken }, 201);
  } catch (error) {
    return fail(res, 'Error registering user', 500);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginInput;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return fail(res, 'Invalid email or password', 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return fail(res, 'Invalid email or password', 401);
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry()
      }
    });

    return success(res, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    return fail(res, 'Error logging in', 500);
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return fail(res, 'Refresh token required', 400);
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      return fail(res, 'Invalid or expired refresh token', 401);
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken }
    });

    if (!storedToken) {
      return fail(res, 'Refresh token not found', 401);
    }

    if (new Date() > storedToken.expiresAt) {
      await prisma.refreshToken.delete({
        where: { token: refreshToken }
      });
      return fail(res, 'Refresh token expired', 401);
    }

    const newAccessToken = generateAccessToken(decoded.userId);

    return success(res, { accessToken: newAccessToken });
  } catch (error) {
    return fail(res, 'Error refreshing token', 500);
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return fail(res, 'Refresh token required', 400);
    }

    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken }
    });

    return success(res, { message: 'Logout successful' });
  } catch (error) {
    return fail(res, 'Error logging out', 500);
  }
};