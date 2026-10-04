import { USE_MOCK, mockRatings, MockRating } from '../dev/mock';
import type { CurrentUser } from '../hooks/useCurrentUser';

const API = process.env.EXPO_PUBLIC_API_BASE_URL;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type MyRating = MockRating;

// TODO: confirm routes/body with the backend teammate, and switch to api/client.ts if the team uses it.
export async function submitRating(user: CurrentUser, g: { id: string; name: string }, rating: number, comment: string) {
  if (USE_MOCK) {
    await wait(600);
    const i = mockRatings.findIndex((r) => r.guesthouse_id === g.id);
    const next = { guesthouse_id: g.id, guesthouse_name: g.name, rating, comment };
    if (i >= 0) mockRatings[i] = { ...mockRatings[i], ...next }; else mockRatings.push(next);
    return;
  }
  const token = await user.getIdToken();
  const res = await fetch(`${API}/ratings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ guesthouse_id: g.id, rating, comment }),
  });
  if (!res.ok) throw new Error(`Server returned ${res.status}`);
}

export async function fetchMyRatings(user: CurrentUser): Promise<MyRating[]> {
  if (USE_MOCK) { await wait(300); return [...mockRatings]; }
  const token = await user.getIdToken();
  const res = await fetch(`${API}/ratings/me`, { headers: { Authorization: `Bearer ${token}` } });
  return res.ok ? res.json() : [];
}