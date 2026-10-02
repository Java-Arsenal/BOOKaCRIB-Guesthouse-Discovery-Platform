import { Request, Response, NextFunction } from 'express';
import { UploadApiResponse } from 'cloudinary';
import { FieldValue } from 'firebase-admin/firestore';
import cloudinary from '../config/cloudinary';
import { db } from '../config/firebase';
import { AppError } from '../utils/AppError';

const guesthouses = db.collection('guesthouses');
// Controller functions for guesthouse routes
export async function listGuesthouses(_req: Request, res: Response, next: NextFunction) {
  try {
    const snapshot = await guesthouses.get();
    res.json({
      success: true,
      data: snapshot.docs.map((doc) => ({ guesthouse_id: doc.id, ...doc.data() })),
    });
  } catch (error) {
    next(error);
  }
}
// Controller functions for guesthouse routes, as defined in the guesthouseController.ts file. These functions handle CRUD operations and image uploads for guesthouses, interacting with Firebase Firestore and Cloudinary for data storage and image management.
export async function getGuesthouse(req: Request, res: Response, next: NextFunction) {
  try {
    const guesthouseId = req.params.guesthouseId;
    if (typeof guesthouseId !== 'string') {
      return next(new AppError(400, 'INVALID_GUESTHOUSE_ID', 'Guesthouse ID is required'));
    }
    const doc = await guesthouses.doc(guesthouseId).get();
    if (!doc.exists) return next(new AppError(404, 'GUESTHOUSE_NOT_FOUND', 'Guesthouse not found'));
    res.json({ success: true, data: { guesthouse_id: doc.id, ...doc.data() } });
  } catch (error) {
    next(error);
  }
}

export async function createGuesthouse(req: Request, res: Response, next: NextFunction) {
  try {
    const data = {
      ...req.body,
      created_by: req.user!.uid,
      average_rating: 0,
      logo_url: null,
      gallery_urls: [],
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    };
    const doc = await guesthouses.add(data);
    res.status(201).json({ success: true, data: { guesthouse_id: doc.id, ...req.body } });
  } catch (error) {
    next(error);
  }
}

export async function updateGuesthouse(req: Request, res: Response, next: NextFunction) {
  try {
    const guesthouseId = req.params.guesthouseId;
    if (typeof guesthouseId !== 'string') {
      return next(new AppError(400, 'INVALID_GUESTHOUSE_ID', 'Guesthouse ID is required'));
    }
    const doc = guesthouses.doc(guesthouseId);
    if (!(await doc.get()).exists) {
      return next(new AppError(404, 'GUESTHOUSE_NOT_FOUND', 'Guesthouse not found'));
    }
    await doc.update({ ...req.body, updated_at: FieldValue.serverTimestamp() });
    res.json({ success: true, data: { guesthouse_id: doc.id, ...req.body } });
  } catch (error) {
    next(error);
  }
}

export async function deleteGuesthouse(req: Request, res: Response, next: NextFunction) {
  try {
    const guesthouseId = req.params.guesthouseId;
    if (typeof guesthouseId !== 'string') {
      return next(new AppError(400, 'INVALID_GUESTHOUSE_ID', 'Guesthouse ID is required'));
    }
    const doc = guesthouses.doc(guesthouseId);
    if (!(await doc.get()).exists) {
      return next(new AppError(404, 'GUESTHOUSE_NOT_FOUND', 'Guesthouse not found'));
    }
    await doc.delete();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function uploadGuesthouseImage(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) return next(new AppError(400, 'IMAGE_REQUIRED', 'An image file is required'));

    const guesthouseId = req.params.guesthouseId;
    if (typeof guesthouseId !== 'string') {
      return next(new AppError(400, 'INVALID_GUESTHOUSE_ID', 'Guesthouse ID is required'));
    }
    const doc = guesthouses.doc(guesthouseId);
    if (!(await doc.get()).exists) {
      return next(new AppError(404, 'GUESTHOUSE_NOT_FOUND', 'Guesthouse not found'));
    }

    const uploaded = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: `guesthouses/${guesthouseId}`, resource_type: 'image' },
          (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error('Cloudinary returned no upload result'));
            resolve(result);
          },
        )
        .end(req.file!.buffer);
    });

    try {
      if (req.body.kind === 'logo') {
        await doc.update({ logo_url: uploaded.secure_url, updated_at: FieldValue.serverTimestamp() });
      } else {
        await doc.update({
          gallery_urls: FieldValue.arrayUnion(uploaded.secure_url),
          updated_at: FieldValue.serverTimestamp(),
        });
      }
    } catch (error) {
      await cloudinary.uploader.destroy(uploaded.public_id).catch(() => undefined);
      throw error;
    }

    res.status(201).json({
      success: true,
      data: { url: uploaded.secure_url, public_id: uploaded.public_id, kind: req.body.kind },
    });
  } catch (error) {
    next(error);
  }
}