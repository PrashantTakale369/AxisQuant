import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface JwtPayload { id: string; role: string }

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) { res.status(401).json({ message: 'Not authenticated' }); return; }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;
    const user = await User.findById(decoded.id);
    if (!user) { res.status(401).json({ message: 'User not found' }); return; }
    (req as Request & { user: typeof user }).user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as Request & { user?: { role: string } }).user;
  if (!user || user.role !== 'admin') {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }
  next();
};
