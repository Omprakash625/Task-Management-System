import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../config/database';

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

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
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

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry()
      }
    });

    res.status(201).json({
      message: 'User registered successfully',
      user,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginInput;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry()
      }
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token required' });
      return;
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      res.status(401).json({ message: 'Invalid or expired refresh token' });
      return;
    }

    // Check if refresh token exists in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken }
    });

    if (!storedToken) {
      res.status(401).json({ message: 'Refresh token not found' });
      return;
    }

    // Check if token is expired
    if (new Date() > storedToken.expiresAt) {
      await prisma.refreshToken.delete({
        where: { token: refreshToken }
      });
      res.status(401).json({ message: 'Refresh token expired' });
      return;
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(decoded.userId);

    res.status(200).json({
      message: 'Token refreshed successfully',
      accessToken: newAccessToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ message: 'Error refreshing token' });
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token required' });
      return;
    }

    // Delete refresh token
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken }
    });

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Error logging out' });
  }
};