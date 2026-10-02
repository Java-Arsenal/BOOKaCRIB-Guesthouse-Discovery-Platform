import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';
import { AppError } from '../utils/AppError';

declare global {
  namespace Express {
    interface Request {
      user?: { uid: string; email?: string };
    }
  }
}

export async function verifyToken(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new AppError(401, 'UNAUTHENTICATED', 'Missing token'));
  }
  try {
    const decoded = await auth.verifyIdToken(header.slice(7));
    req.user = { uid: decoded.uid, email: decoded.email };
    next();
  } catch {
    next(new AppError(401, 'UNAUTHENTICATED', 'Invalid or expired token'));
  }
}
