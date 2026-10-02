import { Request, Response, NextFunction } from 'express';
import { auth, db } from '../config/firebase';
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

export async function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) return next(new AppError(401, 'UNAUTHENTICATED', 'Missing token'));
  const doc = await db.collection('admins').doc(req.user.uid).get();
  if (!doc.exists) return next(new AppError(403, 'FORBIDDEN', 'Admin access required'));
  next();
}
