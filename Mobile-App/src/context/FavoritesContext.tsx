import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { apiRequest } from "../api/client";

interface FavoritesContextValue {
  favoriteIds: string[];
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  toggleFavorite: (guesthouseId: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined,
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  useEffect(
    () =>
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setAuthReady(true);
      }),
    [],
  );

  const loadFavorites = useCallback(async (currentUser: User) => {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    try {
      const token = await currentUser.getIdToken();
      const data = await apiRequest("/customers/me/favourites", {}, token);
      if (!Array.isArray(data) || data.some((item) => typeof item !== "string")) {
        throw new Error("The server returned an invalid favourites list.");
      }
      if (id === requestId.current) setFavoriteIds(data);
    } catch (loadError) {
      if (id === requestId.current) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load your favourites.",
        );
      }
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authReady) return;
    if (!user) {
      requestId.current += 1;
      setFavoriteIds([]);
      setError(null);
      setLoading(false);
      return;
    }
    setFavoriteIds([]);
    void loadFavorites(user);
  }, [authReady, loadFavorites, user]);

  const refresh = useCallback(async () => {
    if (!user) return;
    await loadFavorites(user);
  }, [loadFavorites, user]);

  const toggleFavorite = useCallback(
    async (guesthouseId: string) => {
      if (!user) throw new Error("Log in to save guesthouses.");
      const token = await user.getIdToken();
      const isFavorite = favoriteIds.includes(guesthouseId);
      const method = isFavorite ? "DELETE" : "PUT";
      await apiRequest(
        `/customers/me/favourites/${encodeURIComponent(guesthouseId)}`,
        { method },
        token,
      );
      setFavoriteIds((current) =>
        isFavorite
          ? current.filter((id) => id !== guesthouseId)
          : current.includes(guesthouseId)
            ? current
            : [...current, guesthouseId],
      );
      setError(null);
    },
    [favoriteIds, user],
  );

  const value = useMemo(
    () => ({
      favoriteIds,
      loading,
      error,
      isAuthenticated: authReady && user !== null,
      refresh,
      toggleFavorite,
    }),
    [authReady, error, favoriteIds, loading, refresh, toggleFavorite, user],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used inside FavoritesProvider.");
  }
  return context;
}
