// src/context/AuthContext.tsx
import { createContext, ReactNode, useContext } from 'react';
import type { User } from 'firebase/auth';
import { useCurrentUser } from '../hooks/useCurrentUser';

interface AuthContextValue {
  user: User | null;
  ready: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Thin wrapper over `useCurrentUser` — provides the same auth state via
 * React Context so screens that prefer `useAuth()` over `useCurrentUser()`
 * can access it. Both APIs read the same Firebase session, so mixing them
 * across the codebase is fine.
 *
 * Currently `useCurrentUser` is the primary way screens access auth state
 * (ProfileScreen, useCurrentUser callers); this context exists mainly so
 * the AuthProvider/AuthContext/AuthContext.tsx file structure matches the
 * mobile README's task split, and so future screens have a familiar API.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, ready, logout } = useCurrentUser();
  return (
    <AuthContext.Provider value={{ user, ready, signOut: logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}