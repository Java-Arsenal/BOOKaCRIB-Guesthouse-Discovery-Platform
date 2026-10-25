import React, { useState, useEffect } from "react";

import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { apiGet } from "../api/client";
import SearchBar from "../components/SearchBar";
import { colors, fonts, radius, spacing, shadow } from "../theme/theme";

export interface Guesthouse {
  id: string;
  name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  pricePerNight: number;
  rating: number;
  reviewsCount?: number;
  description: string;
  amenities: string[];
}

type SortKey = "cheapest" | "rated";

const SORTS: {
  key: SortKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  summary: string;
}[] = [
  {
    key: "cheapest",
    label: "Cheapest First",
    icon: "swap-vertical",
    summary: "Cheapest first",
  },
  {
    key: "rated",
    label: "Top Rated",
    icon: "star",
    summary: "Top rated",
  },
];

/** Best-effort icon for an amenity by keyword; falls back to a checkmark. */
function amenityIcon(amenity: string): keyof typeof Ionicons.glyphMap {
  const lower = amenity.toLowerCase();
  if (lower.includes("wi-fi") || lower.includes("wifi")) return "wifi";
  if (lower.includes("parking")) return "car-outline";
  if (lower.includes("air") || lower.includes("a/c") || lower.includes("ac"))
    return "snow-outline";
  if (lower.includes("kitchen")) return "restaurant-outline";
  if (lower.includes("garden")) return "leaf-outline";
  if (lower.includes("solar")) return "sunny-outline";
  if (lower.includes("desk")) return "desktop-outline";
  if (lower.includes("study")) return "book-outline";
  if (lower.includes("river") || lower.includes("deck")) return "water-outline";
  if (lower.includes("power")) return "flash-outline";
  return "checkmark-circle-outline";
}

function SearchResultCard({
  item,
  onPress,
}: {
  item: Guesthouse;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.imageFrame}>
        <View style={styles.pricePill}>
          <Text style={styles.priceText}>
            P{item.pricePerNight} <Text style={styles.perNight}>/ night</Text>
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={13} color={colors.gold} />
            <Text style={styles.ratingText}>
              {item.rating} ({item.reviewsCount ?? 0})
            </Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={colors.slate} />
          <Text style={styles.locationText}>{item.location}, Botswana</Text>
        </View>

        <View style={styles.tagRow}>
          {item.amenities.slice(0, 3).map((a) => (
            <View key={a} style={styles.tag}>
              <Text style={styles.tagText}>{a}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />
        <Text style={styles.viewDetails}>View Details & Contact Host →</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function SearchScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("cheapest");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [listings, setListings] = useState<Guesthouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await apiGet("/guesthouses");
      setListings(
        data.map((item: any) => ({
          id: item.guesthouse_id ?? item.id,
          name: item.name ?? "Unnamed Property",
          location:
            item.city ??
            (typeof item.location === "string" ? item.location : "Botswana"),
          latitude:
            typeof item.location?.latitude === "number"
              ? item.location.latitude
              : undefined,
          longitude:
            typeof item.location?.longitude === "number"
              ? item.location.longitude
              : undefined,
          pricePerNight: item.price_per_night_bwp ?? item.pricePerNight ?? 0,
          rating: item.average_rating ?? 0,
          reviewsCount: item.rating_count ?? 0,
          description: item.description ?? "",
          amenities: Array.isArray(item.amenities) ? item.amenities : [],
        })),
      );
    } catch (err) {
      console.error("Failed to load guesthouses:", err);
      setError(
        "Could not load guesthouses. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    void load();
  }, [load]);

  // Cities present in the loaded data — always in sync with whatever the API
  // returns, so no more hardcoded city misses.
  const cities = useMemo(() => {
    const unique = Array.from(
      new Set(listings.map((l) => l.location).filter(Boolean)),
    ).sort();
    return [
      { key: "all", label: "All Cities" },
      ...unique.map((c) => ({ key: c.toLowerCase(), label: c })),
    ];
  }, [listings]);

  // Every amenity that appears in at least one listing. Sorted A→Z.
  // Any new amenity added to a guesthouse doc shows up here automatically.
  const availableAmenities = useMemo(() => {
    const set = new Set<string>();
    for (const l of listings) {
      for (const a of l.amenities) {
        if (a && a.trim()) set.add(a);
      }
    }
    return Array.from(set).sort();
  }, [listings]);

  function toggleAmenity(amenity: string) {
    setSelectedAmenities((current) =>
      current.includes(amenity)
        ? current.filter((a) => a !== amenity)
        : [...current, amenity],
    );
  }

  const processedData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    let filtered = listings.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q),
    );

    if (selectedCity !== "all") {
      filtered = filtered.filter(
        (item) => item.location.toLowerCase() === selectedCity,
      );
    }

    // Multi-select amenity filter — AND logic: listing must have ALL
    // selected amenities. Flip to `.some()` for OR if you prefer
    // broader results.
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter((item) =>
        selectedAmenities.every((sel) => item.amenities.includes(sel)),
      );
    }

    if (sortBy === "rated") {
      return [...filtered].sort((a, b) => b.rating - a.rating);
    }
    return [...filtered].sort((a, b) => a.pricePerNight - b.pricePerNight);
  }, [listings, searchQuery, selectedCity, selectedAmenities, sortBy]);

  const region =
    selectedCity !== "all"
      ? (cities.find((c) => c.key === selectedCity)?.label ?? "Botswana")
      : "Botswana";

  const sortEntry = SORTS.find((s) => s.key === sortBy);
  const amenitySummary =
    selectedAmenities.length > 0 ? ` · ${selectedAmenities.join(" · ")}` : "";
  const countLabel = `${processedData.length} ${
    processedData.length === 1 ? "result" : "results"
  }`;
  const summary = `${sortEntry?.summary ?? "Cheapest first"}${amenitySummary} · ${countLabel} in ${region}`;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator color={colors.coral} />
          <Text style={styles.centeredText}>Loading guesthouses...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Ionicons
            name="cloud-offline-outline"
            size={42}
            color={colors.slate}
          />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={load}>
            <Text style={styles.retryButtonText}>Try again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.brandTitle}>BOOKaCRIB</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            hitSlop={8}
          >
            <Ionicons
              name="person-circle-outline"
              size={32}
              color={colors.ink}
            />
          </TouchableOpacity>
        </View>

        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
        />

        {/* Sort row — single-select */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
        >
          {SORTS.map((s) => {
            const active = sortBy === s.key;
            return (
              <TouchableOpacity
                key={s.key}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setSortBy(s.key)}
              >
                <Ionicons
                  name={s.icon}
                  size={14}
                  color={
                    active
                      ? colors.white
                      : s.key === "rated"
                        ? colors.gold
                        : colors.ink
                  }
                />
                <Text
                  style={[styles.chipText, active && styles.chipTextActive]}
                >
                  {s.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Amenity row — multi-select, dynamic from data. Teal when active
            so it reads as "filter", distinct from the coral sort chips. */}
        {availableAmenities.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.amenityScroll}
          >
            {availableAmenities.map((amenity) => {
              const active = selectedAmenities.includes(amenity);
              return (
                <TouchableOpacity
                  key={amenity}
                  style={[
                    styles.amenityChip,
                    active && styles.amenityChipActive,
                  ]}
                  onPress={() => toggleAmenity(amenity)}
                >
                  <Ionicons
                    name={amenityIcon(amenity)}
                    size={13}
                    color={active ? colors.white : colors.slate}
                  />
                  <Text
                    style={[
                      styles.amenityChipText,
                      active && styles.amenityChipTextActive,
                    ]}
                  >
                    {amenity}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* City row — single-select, dynamic */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cityRow}
        >
          {cities.map((c) => {
            const active = selectedCity === c.key;
            return (
              <TouchableOpacity
                key={c.key}
                style={[styles.cityBadge, active && styles.cityBadgeActive]}
                onPress={() => setSelectedCity(c.key)}
              >
                <Text
                  style={[styles.cityText, active && styles.cityTextActive]}
                >
                  {c.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={processedData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.coral}
          />
        }
        ListHeaderComponent={
          <View style={styles.summaryPill}>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <SearchResultCard
            item={item}
            onPress={() =>
              navigation.navigate("GuesthouseDetailScreen", {
                guesthouse: item,
              })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyFeed}>
            <Ionicons name="search-outline" size={42} color={colors.slate} />
            <Text style={styles.emptyFeedText}>
              No properties match your active search options.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    gap: spacing.md,
  },
  centeredText: { fontFamily: fonts.body, color: colors.slate },
  errorText: {
    fontFamily: fonts.body,
    color: colors.slate,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
  },
  retryButton: {
    minHeight: 44,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.coral,
    borderRadius: radius.control,
    alignItems: "center",
    justifyContent: "center",
  },
  retryButtonText: {
    fontFamily: fonts.semibold,
    color: colors.white,
    fontSize: 14,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: colors.sand,
    backgroundColor: colors.cream,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  brandTitle: { fontSize: 26, fontFamily: fonts.display, color: colors.ink },

  chipScroll: { marginTop: 12 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.sand,
  },
  chipActive: { backgroundColor: colors.coral, borderColor: colors.coral },
  chipText: { fontSize: 13, fontFamily: fonts.semibold, color: colors.ink },
  chipTextActive: { color: colors.white },

  amenityScroll: { marginTop: 8 },
  amenityChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    marginRight: 6,
    borderWidth: 1,
    borderColor: colors.sand,
  },
  amenityChipActive: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  amenityChipText: {
    fontSize: 12,
    fontFamily: fonts.body,
    color: colors.slate,
  },
  amenityChipTextActive: {
    color: colors.white,
    fontFamily: fonts.semibold,
  },

  cityRow: { marginTop: 12 },
  cityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.sand,
  },
  cityBadgeActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  cityText: { fontSize: 12, fontFamily: fonts.semibold, color: colors.slate },
  cityTextActive: { color: colors.white },

  summaryPill: {
    alignSelf: "flex-start",
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.sand,
  },
  summaryText: { fontSize: 12, fontFamily: fonts.body, color: colors.slate },

  emptyFeed: {
    alignItems: "center",
    marginTop: 40,
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  emptyFeedText: {
    color: colors.slate,
    fontSize: 14,
    fontFamily: fonts.body,
    textAlign: "center",
  },

  card: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.sand,
    overflow: "hidden",
    ...shadow,
  },
  imageFrame: { height: 150, backgroundColor: colors.cream, padding: 12 },
  pricePill: {
    alignSelf: "flex-start",
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.sand,
  },
  priceText: { fontSize: 15, fontFamily: fonts.bold, color: colors.ink },
  perNight: { fontSize: 11, fontFamily: fonts.body, color: colors.slate },
  details: { padding: spacing.md },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    flex: 1,
    marginRight: spacing.sm,
    fontSize: 18,
    fontFamily: fonts.display,
    color: colors.ink,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingTop: 4,
  },
  ratingText: { fontSize: 13, fontFamily: fonts.semibold, color: colors.ink },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  locationText: { fontSize: 13, fontFamily: fonts.body, color: colors.slate },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.sand,
  },
  tagText: { fontSize: 11, fontFamily: fonts.body, color: colors.slate },
  divider: { height: 1, backgroundColor: colors.sand, marginVertical: 12 },
  viewDetails: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.coral,
    textAlign: "center",
  },
});
