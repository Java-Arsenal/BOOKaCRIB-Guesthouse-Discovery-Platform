import { apiRequest } from './client';
import type { CurrentUser } from '../hooks/useCurrentUser';

/**
 * Shape returned to UI. `rating` is the display name for what the backend
 * stores as `score` — normalized here so MyRatingsScreen didn't need to change
 * when we switched from the mock to the real backend.
 *
 * `guesthouse_name` and `city` are joined from /guesthouses client-side
 * because the backend rating documents don't denormalize them.
 */
export interface MyRating {
  rating_id: string;
  guesthouse_id: string;
  guesthouse_name?: string;
  city?: string;
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
  city?: string;
}

/**
 * Submit or update the current user's rating for a guesthouse.
 * Idempotent at the backend — posting the same guesthouse twice updates
 * the existing rating.
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
 * Fetch the current user's ratings. Joins against /guesthouses so
 * `guesthouse_name` and `city` are populated even though the backend
 * doesn't denormalize them onto the rating docs.
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
  const cityById = new Map<string, string>();
  for (const gh of guesthouses) {
    const id = gh.guesthouse_id ?? gh.id;
    if (!id) continue;
    if (gh.name) nameById.set(id, gh.name);
    if (gh.city) cityById.set(id, gh.city);
  }

  return ratings.map((raw) => {
    const guesthouseId = raw.guesthouse_id ?? '';
    const ratingValue = raw.score ?? raw.rating ?? 0;
    return {
      rating_id: raw.rating_id ?? `${guesthouseId}-self`,
      guesthouse_id: guesthouseId,
      guesthouse_name: raw.guesthouse_name ?? nameById.get(guesthouseId),
      city: cityById.get(guesthouseId),
      rating: ratingValue,
      comment: raw.comment ?? '',
      created_at: raw.created_at,
    };
  });
}