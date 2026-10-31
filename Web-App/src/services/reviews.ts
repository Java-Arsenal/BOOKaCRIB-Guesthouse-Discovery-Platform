import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

export interface ReviewItem {
  id: string;
  guesthouseName: string;
  customerName: string;
  rating?: number;
  comment: string;
  date: string;
}

/** Latest ratings that include a written comment, newest first. */
export async function loadRecentReviews(
  guesthouseNames: Record<string, string>,
  max = 10,
): Promise<ReviewItem[]> {
  const snapshot = await getDocs(
    query(collection(db, 'ratings'), orderBy('created_at', 'desc'), limit(50)),
  );

  return snapshot.docs
    .map((d) => d.data())
    .filter((r) => typeof r.comment === 'string' && r.comment.trim() !== '')
    .slice(0, max)
    .map((r) => ({
      id: r.rating_id as string,
      guesthouseName: guesthouseNames[r.guesthouse_id] ?? 'Unknown guesthouse',
      customerName: 'Guest',
      rating: Number(r.score ?? 0),
      comment: r.comment as string,
      date: r.created_at?.toDate ? r.created_at.toDate().toLocaleDateString() : '',
    }));
}