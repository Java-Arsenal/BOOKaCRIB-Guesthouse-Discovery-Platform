import { useCallback, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "../../firebaseConfig";

/**
 * Real Firebase-backed auth hook.
 *
 * Replaces the previous mock implementation (`USE_MOCK` / `mockUser` /
 * `mockLogout`). Firebase Auth state is the single source of truth across
 * the app — FavoritesContext reads it directly, and now so does this hook.
 */
export type CurrentUser = User;

interface UseCurrentUserResult {
  /** Firebase user, or null when signed out. */
  user: CurrentUser | null;
  /** True once Firebase has resolved the initial auth state (from
   *  AsyncStorage on native, IndexedDB on web). Use this to avoid
   *  flashing the logged-out UI on the first frame after launch. */
  ready: boolean;
  /** Signs out of Firebase. Clears the persisted session from
   *  AsyncStorage (native) / IndexedDB (web). */
  logout: () => Promise<void>;
}

export function useCurrentUser(): UseCurrentUserResult {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Fires once with the cached user (or null), then on every
    // sign-in / sign-out event. Same subscription FavoritesContext uses,
    // so both hooks update together.
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setReady(true);
    });
    return unsubscribe;
  }, []);

  const logout = useCallback(async () => {
    // Clears Firebase session + persisted storage. Triggers
    // onAuthStateChanged in *both* this hook and FavoritesContext,
    // so the whole tree updates together.
    await signOut(auth);
  }, []);

  return { user, ready, logout };
}