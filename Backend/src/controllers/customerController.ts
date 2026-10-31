import { Request, Response, NextFunction } from 'express';
import { auth, db } from '../config/firebase';
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
            status: 'active',
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
        data: { customer_id: uid, full_name, email: email ?? null, favourites: [], status: 'active' },
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

export async function getFavourites(req: Request, res: Response, next: NextFunction) {
    const customer = await db.collection('customers').doc(req.user!.uid).get();
    if (!customer.exists) {
        return next(new AppError(404, 'CUSTOMER_NOT_FOUND', 'Customer profile not found'));
    }

    const favourites = customer.get('favourites');
    res.json({ success: true, data: Array.isArray(favourites) ? favourites : [] });
}

export async function addFavourite(req: Request, res: Response, next: NextFunction) {
    const guesthouseId = req.params.guesthouseId;
    if (typeof guesthouseId !== 'string' || !guesthouseId.trim()) {
        return next(new AppError(400, 'INVALID_GUESTHOUSE_ID', 'Guesthouse ID is required'));
    }

    const customerRef = db.collection('customers').doc(req.user!.uid);
    const guesthouseRef = db.collection('guesthouses').doc(guesthouseId);
    const [customer, guesthouse] = await Promise.all([customerRef.get(), guesthouseRef.get()]);
    if (!customer.exists) {
        return next(new AppError(404, 'CUSTOMER_NOT_FOUND', 'Customer profile not found'));
    }
    if (!guesthouse.exists) {
        return next(new AppError(404, 'GUESTHOUSE_NOT_FOUND', 'Guesthouse not found'));
    }

    await customerRef.update({ favourites: FieldValue.arrayUnion(guesthouseId) });
    res.status(204).end();
}

export async function removeFavourite(req: Request, res: Response, next: NextFunction) {
    const guesthouseId = req.params.guesthouseId;
    if (typeof guesthouseId !== 'string' || !guesthouseId.trim()) {
        return next(new AppError(400, 'INVALID_GUESTHOUSE_ID', 'Guesthouse ID is required'));
    }

    const customerRef = db.collection('customers').doc(req.user!.uid);
    if (!(await customerRef.get()).exists) {
        return next(new AppError(404, 'CUSTOMER_NOT_FOUND', 'Customer profile not found'));
    }

    await customerRef.update({ favourites: FieldValue.arrayRemove(guesthouseId) });
    res.status(204).end();
}

// --- Admin-only endpoints below: managing mobile-app customer accounts ---

export async function listCustomers(_req: Request, res: Response) {
    const snapshot = await db.collection('customers').get();
    const data = snapshot.docs.map((d) => {
        const c = d.data();
        const createdAt = c.created_at?.toDate ? c.created_at.toDate().toISOString() : null;
        return {
            customer_id: c.customer_id ?? d.id,
            full_name: c.full_name,
            email: c.email ?? null,
            status: c.status ?? 'active',
            created_at: createdAt,
        };
    });
    res.json({ success: true, data });
}

export async function setCustomerStatus(req: Request, res: Response, next: NextFunction) {
    const customerId = req.params.customerId;
    if (typeof customerId !== 'string' || !customerId.trim()) {
        return next(new AppError(400, 'INVALID_CUSTOMER_ID', 'Customer ID is required'));
    }
    const { status } = req.body;
    const ref = db.collection('customers').doc(customerId);
    const doc = await ref.get();
    if (!doc.exists) {
        return next(new AppError(404, 'CUSTOMER_NOT_FOUND', 'Customer profile not found'));
    }
    await ref.update({ status });
    res.json({ success: true, data: { ...doc.data(), status } });
}

export async function deleteCustomer(req: Request, res: Response, next: NextFunction) {
    const customerId = req.params.customerId;
    if (typeof customerId !== 'string' || !customerId.trim()) {
        return next(new AppError(400, 'INVALID_CUSTOMER_ID', 'Customer ID is required'));
    }
    const ref = db.collection('customers').doc(customerId);
    const doc = await ref.get();
    if (!doc.exists) {
        return next(new AppError(404, 'CUSTOMER_NOT_FOUND', 'Customer profile not found'));
    }
    await ref.delete();
    try {
        await auth.deleteUser(customerId);
    } catch (err: any) {
        if (err.code !== 'auth/user-not-found') {
            return next(err);
        }
    }
    res.status(204).end();
}
