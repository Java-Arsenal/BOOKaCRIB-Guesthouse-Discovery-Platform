import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { apiGet } from "../api/client";
import FavoriteButton from "../components/FavoriteButton";
import { useFavorites } from "../context/FavoritesContext";
import { colors, fonts, radius, shadow, spacing } from "../theme/theme";

interface Guesthouse {
  guesthouse_id: string;
  name: string;
  city?: string;
  location?: string | { latitude?: number; longitude?: number };
  price_per_night_bwp?: number;
  average_rating?: number;
  rating_count?: number;
  description?: string;
  amenities?: string[];
}

export default function FavoritesScreen({ navigation }: any) {
  const { favoriteIds, loading, error, isAuthenticated, refresh } =
    useFavorites();
  const [guesthouses, setGuesthouses] = useState<Guesthouse[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated) return;
      let active = true;
      setListLoading(true);
      setListError(null);
      apiGet("/guesthouses")
        .then((data) => {
          if (!Array.isArray(data)) {
            throw new Error("The server returned an invalid guesthouse list.");
          }
          if (active) setGuesthouses(data);
        })
        .catch((fetchError) => {
          if (active) {
            setListError(
              fetchError instanceof Error
                ? fetchError.message
                : "Could not load guesthouses.",
            );
          }
        })
        .finally(() => {
          if (active) setListLoading(false);
        });
      return () => {
        active = false;
      };
    }, [isAuthenticated]),
  );

  const favorites = useMemo(
    () => guesthouses.filter((guesthouse) => favoriteIds.includes(guesthouse.guesthouse_id)),
    [favoriteIds, guesthouses],
  );

  const openGuesthouse = (guesthouse: Guesthouse) => {
    const location =
      guesthouse.city ??
      (typeof guesthouse.location === "string" ? guesthouse.location : "Botswana");
    navigation.navigate("GuesthouseDetailScreen", {
      guesthouse: {
        id: guesthouse.guesthouse_id,
        name: guesthouse.name,
        location,
        pricePerNight: guesthouse.price_per_night_bwp ?? 0,
        rating: guesthouse.average_rating ?? 0,
        reviewsCount: guesthouse.rating_count ?? 0,
        latitude:
          typeof guesthouse.location === "object"
            ? guesthouse.location.latitude
            : undefined,
        longitude:
          typeof guesthouse.location === "object"
            ? guesthouse.location.longitude
            : undefined,
        description: guesthouse.description ?? "",
        amenities: guesthouse.amenities ?? [],
      },
    });
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.center}>
        <Ionicons name="heart-outline" size={42} color={colors.coral} />
        <Text style={styles.title}>Your saved stays</Text>
        <Text style={styles.message}>Log in to view and manage your favourites.</Text>
        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.primaryButtonText}>Log in</Text>
        </Pressable>
      </View>
    );
  }

  if (loading || listLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.coral} />
        <Text style={styles.message}>Loading your favourites...</Text>
      </View>
    );
  }

  if (error || listError) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>{error ?? listError}</Text>
        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            void refresh();
            setListError(null);
            setListLoading(true);
            apiGet("/guesthouses")
              .then((data) => {
                if (!Array.isArray(data)) {
                  throw new Error("The server returned an invalid guesthouse list.");
                }
                setGuesthouses(data);
              })
              .catch((fetchError) => {
                setListError(
                  fetchError instanceof Error
                    ? fetchError.message
                    : "Could not load guesthouses.",
                );
              })
              .finally(() => setListLoading(false));
          }}
        >
          <Text style={styles.primaryButtonText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={[
        styles.list,
        favorites.length === 0 && styles.emptyList,
      ]}
      data={favorites}
      keyExtractor={(item) => item.guesthouse_id}
      ListEmptyComponent={
        <View style={styles.center}>
          <Ionicons name="heart-outline" size={42} color={colors.slate} />
          <Text style={styles.title}>No favourites yet</Text>
          <Text style={styles.message}>
            Save a guesthouse and it will appear here.
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.cardHeading}>
              <Pressable
                style={styles.nameButton}
                onPress={() => openGuesthouse(item)}
              >
                <Text style={styles.name} numberOfLines={2}>
                  {item.name}
                </Text>
              </Pressable>
              <FavoriteButton
                guesthouseId={item.guesthouse_id}
                onRequireLogin={() => navigation.navigate("Login")}
              />
            </View>
            <Pressable onPress={() => openGuesthouse(item)}>
              <Text style={styles.meta}>
                {item.city ?? "Botswana"} · P{item.price_per_night_bwp ?? 0} / night
              </Text>
              <Text style={styles.rating}>
                ★ {item.average_rating ?? 0} ({item.rating_count ?? 0})
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  list: { padding: spacing.md, gap: spacing.md, flexGrow: 1 },
  emptyList: { justifyContent: "center" },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    ...shadow,
  },
  cardContent: { padding: spacing.md },
  nameButton: { flex: 1 },
  cardHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  name: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 17,
    color: colors.ink,
  },
  meta: {
    marginTop: spacing.xs,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.slate,
  },
  rating: {
    marginTop: spacing.sm,
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.ink,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    backgroundColor: colors.cream,
  },
  title: {
    marginTop: spacing.md,
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.ink,
    textAlign: "center",
  },
  message: {
    marginTop: spacing.sm,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.slate,
    textAlign: "center",
  },
  primaryButton: {
    minHeight: 46,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.control,
    backgroundColor: colors.coral,
  },
  primaryButtonText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.white,
  },
});