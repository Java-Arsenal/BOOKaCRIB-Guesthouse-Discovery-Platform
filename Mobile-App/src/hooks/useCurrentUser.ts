import { USE_MOCK, mockUser, mockLogout } from '../dev/mock';

export type CurrentUser = { displayName?: string | null; email?: string | null; getIdToken: () => Promise<string> };


export function useCurrentUser(): { user: CurrentUser | null; logout: () => void } {
  if (USE_MOCK) return { user: mockUser, logout: mockLogout };
  throw new Error('Real auth is not connected yet. Set USE_MOCK = true in src/dev/mock.ts, or wire up AuthContext here.');
}