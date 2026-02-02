import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { verifyAccessToken } from '../utils/jwt';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const token = authHeader.substring(7);

    try {
      const decoded = verifyAccessToken(token);
      req.userId = decoded.userId;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: 'Authentication error' });
    return;
  }
};