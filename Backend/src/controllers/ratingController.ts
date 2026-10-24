import { Request, Response, NextFunction } from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../config/firebase';
import { AppError } from '../utils/AppError';

const ratings = db.collection('ratings');
const guesthouses = db.collection('guesthouses');

function hasRatingAggregate(data: FirebaseFirestore.DocumentData): boolean {
  return (
    typeof data.rating_sum === 'number' &&
    Number.isFinite(data.rating_sum) &&
    typeof data.rating_count === 'number' &&
    Number.isInteger(data.rating_count) &&
    data.rating_count >= 0
  );
}

async function readAggregate(
  transaction: FirebaseFirestore.Transaction,
  guesthouseId: string,
  guesthouseData: FirebaseFirestore.DocumentData,
) {
  if (hasRatingAggregate(guesthouseData)) {
    return {
      sum: guesthouseData.rating_sum as number,
      count: guesthouseData.rating_count as number,
    };
  }

  // Backfill aggregates from existing ratings for guesthouses created before these fields existed.
  const snapshot = await transaction.get(ratings.where('guesthouse_id', '==', guesthouseId));
  return snapshot.docs.reduce(
    (aggregate, doc) => {
      const score = doc.get('score');
      if (typeof score === 'number' && Number.isFinite(score)) {
        aggregate.sum += score;
        aggregate.count += 1;
      }
      return aggregate;
    },
    { sum: 0, count: 0 },
  );
}

export async function upsertRating(req: Request, res: Response, next: NextFunction) {
  const { guesthouse_id, score, comment } = req.body;
  const customerId = req.user!.uid;
  const ratingId = `${customerId}_${guesthouse_id}`;
  const guesthouseRef = guesthouses.doc(guesthouse_id);
  const ratingRef = ratings.doc(ratingId);
  const updatedAt = new Date().toISOString();
  let responseData: Record<string, unknown> | undefined;

  try {
    await db.runTransaction(async (transaction) => {
      // Keep a rating write and its guesthouse aggregate in one commit to prevent drift.
      const [guesthouseSnapshot, ratingSnapshot] = await Promise.all([
        transaction.get(guesthouseRef),
        transaction.get(ratingRef),
      ]);
      if (!guesthouseSnapshot.exists) {
        throw new AppError(404, 'GUESTHOUSE_NOT_FOUND', 'Guesthouse not found');
      }

      const aggregate = await readAggregate(transaction, guesthouse_id, guesthouseSnapshot.data() ?? {});
      const existingScore = ratingSnapshot.exists ? ratingSnapshot.get('score') : 0;
      const sum = aggregate.sum - (typeof existingScore === 'number' ? existingScore : 0) + score;
      const count = aggregate.count + (ratingSnapshot.exists ? 0 : 1);
      const createdAt = ratingSnapshot.exists
        ? ratingSnapshot.get('created_at') ?? FieldValue.serverTimestamp()
        : FieldValue.serverTimestamp();

      transaction.set(ratingRef, {
        rating_id: ratingId,
        guesthouse_id,
        customer_id: customerId,
        score,
        comment: comment ?? '',
        created_at: createdAt,
        updated_at: FieldValue.serverTimestamp(),
      });
      transaction.update(guesthouseRef, {
        rating_sum: sum,
        rating_count: count,
        average_rating: count === 0 ? 0 : sum / count,
        updated_at: FieldValue.serverTimestamp(),
      });

      responseData = {
        rating_id: ratingId,
        guesthouse_id,
        customer_id: customerId,
        score,
        comment: comment ?? '',
        created_at: ratingSnapshot.exists
          ? ratingSnapshot.get('created_at') ?? updatedAt
          : updatedAt,
        updated_at: updatedAt,
      };
    });

    res.json({ success: true, data: responseData });
  } catch (error) {
    next(error);
  }
}

export async function getMyRatings(req: Request, res: Response, next: NextFunction) {
  try {
    const snapshot = await ratings.where('customer_id', '==', req.user!.uid).get();
    res.json({ success: true, data: snapshot.docs.map((doc) => doc.data()) });
  } catch (error) {
    next(error);
  }
}

export async function getGuesthouseRatings(req: Request, res: Response, next: NextFunction) {
  const guesthouseId = req.params.guesthouseId;
  if (typeof guesthouseId !== 'string') {
    return next(new AppError(400, 'INVALID_GUESTHOUSE_ID', 'Guesthouse ID is required'));
  }

  try {
    const snapshot = await ratings.where('guesthouse_id', '==', guesthouseId).get();
    res.json({ success: true, data: snapshot.docs.map((doc) => doc.data()) });
  } catch (error) {
    next(error);
  }
}

export async function deleteMyRating(req: Request, res: Response, next: NextFunction) {
  const customerId = req.user!.uid;
  const guesthouseId = req.params.guesthouseId;
  if (typeof guesthouseId !== 'string') {
    return next(new AppError(400, 'INVALID_GUESTHOUSE_ID', 'Guesthouse ID is required'));
  }
  const ratingRef = ratings.doc(`${customerId}_${guesthouseId}`);
  const guesthouseRef = guesthouses.doc(guesthouseId);

  try {
    await db.runTransaction(async (transaction) => {
      const ratingSnapshot = await transaction.get(ratingRef);
      if (!ratingSnapshot.exists) return;

      const guesthouseSnapshot = await transaction.get(guesthouseRef);
      transaction.delete(ratingRef);
      if (!guesthouseSnapshot.exists) return;

      const aggregate = await readAggregate(
        transaction,
        guesthouseId,
        guesthouseSnapshot.data() ?? {},
      );
      // Clamp the count so legacy or inconsistent data cannot produce a negative rating_count.
      const score = ratingSnapshot.get('score');
      const sum = aggregate.sum - (typeof score === 'number' ? score : 0);
      const count = Math.max(0, aggregate.count - 1);
      transaction.update(guesthouseRef, {
        rating_sum: sum,
        rating_count: count,
        average_rating: count === 0 ? 0 : sum / count,
        updated_at: FieldValue.serverTimestamp(),
      });
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
