import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt.js';

export interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    return;
  }

  const decoded = verifyToken(token);
  if (decoded === 'Invalid token') {
    res.status(401).json({ success: false, message: 'Access denied. Invalid token.' });
    return;
  }

  // Attach user info from token payload
  req.user = decoded as { userId: string; role: string };
  next();
};
