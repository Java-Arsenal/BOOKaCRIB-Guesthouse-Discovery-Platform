import { Request, Response, NextFunction } from 'express';
import { auth, db } from '../config/firebase';
import { AppError } from '../utils/AppError';
import { FieldValue } from 'firebase-admin/firestore';

export async function createAdmin(req: Request, res: Response, next: NextFunction) {
  const { full_name, email, password, role } = req.body;
  let userRecord;
  try {
    userRecord = await auth.createUser({ email, password, displayName: full_name });
  } catch (err: any) {
    if (err.code === 'auth/email-already-exists') {
      return next(new AppError(409, 'EMAIL_EXISTS', 'An account with this email already exists'));
    }
    return next(err);
  }

  try {
    await db.collection('admins').doc(userRecord.uid).set({
      admin_id: userRecord.uid,
      full_name,
      email,
      role,
      created_at: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    await auth.deleteUser(userRecord.uid); // roll back orphaned auth user
    return next(err);
  }

  res.status(201).json({
    success: true,
    data: { admin_id: userRecord.uid, full_name, email, role },
  });
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  const doc = await db.collection('admins').doc(req.user!.uid).get();
  if (!doc.exists) return next(new AppError(404, 'ADMIN_NOT_FOUND', 'Admin profile not found'));
  res.json({ success: true, data: doc.data() });
}

export async function listAdmins(_req: Request, res: Response) {
  const snapshot = await db.collection('admins').get();
  res.json({ success: true, data: snapshot.docs.map((d) => d.data()) });
}
