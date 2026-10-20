import { Request, Response, NextFunction } from 'express';
import { db } from '../config/firebase';
import { AppError } from '../utils/AppError';
import { FieldValue } from 'firebase-admin/firestore';

const ALREADY_EXISTS = 6;

export async function createCustomer(req: Request, res: Response, next: NextFunction) {
    const { uid, email } = req.user!;
    const { full_name } = req.body;

    try {
        await db.collection('customers').doc(uid).create({
            customer_id: uid,
            full_name,
            email: email ?? null,
            favourites: [],
            created_at: FieldValue.serverTimestamp(),
        });
    } catch (err: any) {
        if (err.code === ALREADY_EXISTS) {
            return next(new AppError(409, 'CUSTOMER_EXISTS', 'A profile already exists for this account'));
        }
        return next(err);
    }

    res.status(201).json({
        success: true,
        data: { customer_id: uid, full_name, email: email ?? null, favourites: [] },
    });
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
    const doc = await db.collection('customers').doc(req.user!.uid).get();
    if (!doc.exists) {
        return next(new AppError(404, 'CUSTOMER_NOT_FOUND', 'Customer profile not found'));
    }
    res.json({ success: true, data: doc.data() });
}

export async function updateMe(req: Request, res: Response, next: NextFunction) {
    const ref = db.collection('customers').doc(req.user!.uid);
    const doc = await ref.get();
    if (!doc.exists) {
        return next(new AppError(404, 'CUSTOMER_NOT_FOUND', 'Customer profile not found'));
    }
    await ref.update({full_name: req.body.full_name });
    res.json({ success: true, data: { ...doc.data(), full_name: req.body.full_name } });
}