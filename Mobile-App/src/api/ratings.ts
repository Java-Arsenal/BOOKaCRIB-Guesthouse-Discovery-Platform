import { apiRequest } from './client';
import type { CurrentUser } from '../hooks/useCurrentUser';

/**
 * Shape returned to UI. `rating` is the display name for what the backend
 * stores as `score` — normalized here so MyRatingsScreen didn't need to change
 * when we switched from the mock to the real backend.
 */
export interface MyRating {
  rating_id: string;
  guesthouse_id: string;
  guesthouse_name?: string;
  /** Rating out of 5. Backend stores this as `score`. */
  rating: number;
  comment: string;
  created_at?: unknown;
}

interface RawRating {
  rating_id?: string;
  guesthouse_id?: string;
  guesthouse_name?: string;
  /** Backend field name */
  score?: number;
  /** Legacy/mock field name — accepted as fallback */
  rating?: number;
  comment?: string;
  created_at?: unknown;
}

interface RawGuesthouse {
  guesthouse_id?: string;
  id?: string;
  name?: string;
}

/**
 * Submit or update the current user's rating for a guesthouse.
 * Idempotent at the backend — posting the same guesthouse twice updates
 * the existing rating (backend behavior; verify with team lead).
 */
export async function submitRating(
  user: CurrentUser,
  guesthouse: { id: string; name: string },
  rating: number,
  comment: string,
): Promise<void> {
  const token = await user.getIdToken();
  await apiRequest(
    '/ratings',
    {
      method: 'POST',
      body: JSON.stringify({
        guesthouse_id: guesthouse.id,
        score: rating,
        comment,
      }),
    },
    token,
  );
}

/**
 * Fetch the current user's ratings. Also pulls the guesthouse list so that
 * `guesthouse_name` can be filled in even if the backend doesn't denormalize
 * it on the rating documents.
 */
export async function fetchMyRatings(user: CurrentUser): Promise<MyRating[]> {
  const token = await user.getIdToken();

  const [ratingsData, guesthousesData] = await Promise.all([
    apiRequest('/ratings/me', {}, token).catch(() => []),
    apiRequest('/guesthouses', {}).catch(() => []),
  ]);

  const ratings: RawRating[] = Array.isArray(ratingsData) ? ratingsData : [];
  const guesthouses: RawGuesthouse[] = Array.isArray(guesthousesData)
    ? guesthousesData
    : [];

  const nameById = new Map<string, string>();
  for (const gh of guesthouses) {
    const id = gh.guesthouse_id ?? gh.id;
    if (id && gh.name) nameById.set(id, gh.name);
  }

  return ratings.map((raw) => {
    const guesthouseId = raw.guesthouse_id ?? '';
    const ratingValue = raw.score ?? raw.rating ?? 0;
    return {
      rating_id: raw.rating_id ?? `${guesthouseId}-self`,
      guesthouse_id: guesthouseId,
      guesthouse_name: raw.guesthouse_name ?? nameById.get(guesthouseId),
      rating: ratingValue,
      comment: raw.comment ?? '',
      created_at: raw.created_at,
    };
  });
}