import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  LayoutAnimation,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { apiGet } from "../api/client";
import SearchBar from "../components/SearchBar";
import { colors, fonts, radius, spacing, shadow } from "../theme/theme";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
  logoUrl?: string | null;
  galleryUrls?: string[];
  hostName?: string;
  hostPhone?: string;
  hostEmail?: string;
  country?: string;
}

type SortKey = "cheapest" | "rated";

const SORTS: {
  key: SortKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: "cheapest", label: "Cheapest", icon: "swap-vertical" },
  { key: "rated", label: "Top Rated", icon: "star" },
];

function amenityIcon(amenity: string): keyof typeof Ionicons.glyphMap {
  const lower = amenity.toLowerCase();
  if (lower.includes("wi-fi") || lower.includes("wifi")) return "wifi";
  if (lower.includes("parking")) return "car-outline";
  if (lower.includes("air") || lower.includes("a/c") || lower.includes("ac")) return "snow-outline";
  if (lower.includes("kitchen")) return "restaurant-outline";
  if (lower.includes("garden")) return "leaf-outline";
  if (lower.includes("solar")) return "sunny-outline";
  if (lower.includes("desk")) return "desktop-outline";
  if (lower.includes("study")) return "book-outline";
  if (lower.includes("river") || lower.includes("deck")) return "water-outline";
  if (lower.includes("power")) return "flash-outline";
  return "checkmark-circle-outline";
}

// NEW: Skeleton Card Component
function SkeletonCard() {
  return (
    <View style={[styles.card, { opacity: 0.6 }]}>
      <View style={[styles.imageFrame, { backgroundColor: colors.sand }]} />
      <View style={styles.details}>
        <View style={{ width: "70%", height: 20, backgroundColor: colors.sand, borderRadius: 4, marginBottom: 8 }} />
        <View style={{ width: "40%", height: 14, backgroundColor: colors.sand, borderRadius: 4, marginBottom: 16 }} />
        <View style={{ flexDirection: "row", gap: 6, marginBottom: 16 }}>
          <View style={{ width: 60, height: 24, backgroundColor: colors.sand, borderRadius: radius.pill }} />
          <View style={{ width: 50, height: 24, backgroundColor: colors.sand, borderRadius: radius.pill }} />
          <View style={{ width: 70, height: 24, backgroundColor: colors.sand, borderRadius: radius.pill }} />
        </View>
        <View style={{ height: 1, backgroundColor: colors.sand, marginVertical: 12 }} />
        <View style={{ width: "50%", height: 16, backgroundColor: colors.sand, borderRadius: 4, alignSelf: "center" }} />
      </View>
    </View>
  );
}

function SearchResultCard({ item, onPress }: { item: Guesthouse; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.imageFrame}>
        {item.logoUrl && (
          <Image source={{ uri: item.logoUrl }} style={styles.cardImage} />
        )}
        <View style={styles.pricePill}>
          <Text style={styles.priceText}>
            P{item.pricePerNight}{" "}
            <Text style={styles.perNight}>/ night</Text>
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={13} color={colors.gold} />
            <Text style={styles.ratingText}>{item.rating} ({item.reviewsCount ?? 0})</Text>
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

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
          location: item.city ?? (typeof item.location === "string" ? item.location : "Botswana"),
          latitude: typeof item.location?.latitude === "number" ? item.location.latitude : undefined,
          longitude: typeof item.location?.longitude === "number" ? item.location.longitude : undefined,
          pricePerNight: item.price_per_night_bwp ?? item.pricePerNight ?? 0,
          rating: item.average_rating ?? 0,
          reviewsCount: item.rating_count ?? 0,
          description: item.description ?? "",
          amenities: Array.isArray(item.amenities) ? item.amenities : [],
          logoUrl: item.logo_url ?? null,
          galleryUrls: Array.isArray(item.gallery_urls) ? item.gallery_urls : [],
          hostName: item.contact_details?.contact_name ?? undefined,
          hostPhone: item.contact_details?.phone ?? undefined,
          hostEmail: item.contact_details?.email ?? undefined,
          country: item.country ?? "Botswana",
        })),
      );
    } catch (err) {
      console.error("Failed to load guesthouses:", err);
      setError("Could not load guesthouses. Check your connection and try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    void load();
  }, [load]);

  const cities = useMemo(() => {
    const unique = Array.from(new Set(listings.map((l) => l.location).filter(Boolean))).sort();
    return [{ key: "all", label: "All Cities" }, ...unique.map((c) => ({ key: c.toLowerCase(), label: c }))];
  }, [listings]);

  const availableAmenities = useMemo(() => {
    const set = new Set<string>();
    for (const l of listings) {
      for (const a of l.amenities) {
        if (a && a.trim()) set.add(a);
      }
    }
    return Array.from(set).sort();
  }, [listings]);

  function toggleFilters() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFiltersOpen((v) => !v);
  }

  function toggleAmenity(amenity: string) {
    setSelectedAmenities((current) =>
      current.includes(amenity) ? current.filter((a) => a !== amenity) : [...current, amenity]
    );
  }

  function clearAll() {
    setSortBy("cheapest");
    setSelectedCity("all");
    setSelectedAmenities([]);
  }

  const activeFilterCount = selectedAmenities.length + (sortBy !== "cheapest" ? 1 : 0) + (selectedCity !== "all" ? 1 : 0);

  const processedData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    let filtered = listings.filter((item) => item.name.toLowerCase().includes(q) || item.location.toLowerCase().includes(q));

    if (selectedCity !== "all") {
      filtered = filtered.filter((item) => item.location.toLowerCase() === selectedCity);
    }
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter((item) => selectedAmenities.every((sel) => item.amenities.includes(sel)));
    }

    if (sortBy === "rated") {
      return [...filtered].sort((a, b) => b.rating - a.rating);
    }
    return [...filtered].sort((a, b) => a.pricePerNight - b.pricePerNight);
  }, [listings, searchQuery, selectedCity, selectedAmenities, sortBy]);

  const resultCount = processedData.length;
  const resultCountLabel = `${resultCount} ${resultCount === 1 ? "result" : "results"}`;

  // NEW: Skeleton Loading UI
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.brandTitle}>BOOKaCRIB</Text>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.sand }} />
          </View>
          <View style={styles.searchRow}>
            <View style={[styles.filterButton, { backgroundColor: colors.sand, borderColor: colors.sand }]} />
            <View style={[styles.searchBarWrap, { height: 46, backgroundColor: colors.sand, borderRadius: radius.control }]} />
          </View>
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Ionicons name="cloud-offline-outline" size={42} color={colors.slate} />
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
          <TouchableOpacity onPress={() => navigation.navigate("Profile")} hitSlop={8}>
            <Ionicons name="person-circle-outline" size={32} color={colors.ink} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <TouchableOpacity style={[styles.filterButton, filtersOpen && styles.filterButtonOpen]} onPress={toggleFilters}>
            <Ionicons name="options-outline" size={20} color={filtersOpen ? colors.white : colors.ink} />
            {activeFilterCount > 0 && (
              <View style={styles.badge}><Text style={styles.badgeText}>{activeFilterCount}</Text></View>
            )}
          </TouchableOpacity>

          <View style={styles.searchBarWrap}>
            <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClear={() => setSearchQuery("")} />
          </View>

          <TouchableOpacity style={styles.toggleViewButton} onPress={() => setViewMode(viewMode === "list" ? "map" : "list")}>
            <Ionicons name={viewMode === "list" ? "map-outline" : "list-outline"} size={20} color={colors.ink} />
          </TouchableOpacity>
        </View>

        {filtersOpen && (
          <View style={styles.filterPanel}>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionLabel}>Sort</Text>
              <View style={styles.chipRowWrap}>
                {SORTS.map((s) => {
                  const active = sortBy === s.key;
                  return (
                    <TouchableOpacity key={s.key} style={[styles.chip, active && styles.chipActive]} onPress={() => setSortBy(s.key)}>
                      <Ionicons name={s.icon} size={13} color={active ? colors.white : s.key === "rated" ? colors.gold : colors.ink} />
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>{s.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionLabel}>City</Text>
              <View style={styles.chipRowWrap}>
                {cities.map((c) => {
                  const active = selectedCity === c.key;
                  return (
                    <TouchableOpacity key={c.key} style={[styles.chip, active && styles.chipActive]} onPress={() => setSelectedCity(c.key)}>
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>{c.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionLabel}>Amenities {selectedAmenities.length > 0 && `(${selectedAmenities.length})`}</Text>
              <ScrollView style={styles.amenityScroll} contentContainerStyle={styles.amenityScrollContent} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                <View style={styles.chipRowWrap}>
                  {availableAmenities.map((amenity) => {
                    const active = selectedAmenities.includes(amenity);
                    return (
                      <TouchableOpacity key={amenity} style={[styles.chip, active && styles.amenityChipActive]} onPress={() => toggleAmenity(amenity)}>
                        <Ionicons name={amenityIcon(amenity)} size={13} color={active ? colors.white : colors.slate} />
                        <Text style={[styles.chipText, active && styles.chipTextActive]}>{amenity}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>

            <View style={styles.filterFooter}>
              <TouchableOpacity style={styles.clearButton} onPress={clearAll} disabled={activeFilterCount === 0}>
                <Text style={[styles.clearButtonText, activeFilterCount === 0 && styles.clearButtonTextDisabled]}>Clear all</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.doneButton} onPress={toggleFilters}>
                <Text style={styles.doneButtonText}>Show {resultCountLabel}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {viewMode === "list" ? (
        <FlatList
          data={processedData}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: spacing.xl }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.coral} />}
          renderItem={({ item }) => (
            <SearchResultCard
              item={item}
              onPress={() => navigation.navigate("GuesthouseDetailScreen", { guesthouse: item })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyFeed}>
              <Ionicons name="search-outline" size={42} color={colors.slate} />
              <Text style={styles.emptyFeedText}>No properties match your active search options.</Text>
            </View>
          }
        />
      ) : (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: processedData[0]?.latitude ?? -24.6282, 
            longitude: processedData[0]?.longitude ?? 25.9231,
            latitudeDelta: 3.0,
            longitudeDelta: 3.0,
          }}
        >
          {processedData.map((item) => (
            item.latitude && item.longitude && (
              <Marker
                key={item.id}
                coordinate={{ latitude: item.latitude, longitude: item.longitude }}
                title={item.name}
                description={`P${item.pricePerNight} / night`}
                onCalloutPress={() => navigation.navigate("GuesthouseDetailScreen", { guesthouse: item })}
              />
            )
          ))}
        </MapView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg, gap: spacing.md },
  centeredText: { fontFamily: fonts.body, color: colors.slate },
  errorText: { fontFamily: fonts.body, color: colors.slate, textAlign: "center", fontSize: 14, lineHeight: 20 },
  retryButton: { minHeight: 44, paddingHorizontal: spacing.xl, backgroundColor: colors.coral, borderRadius: radius.control, alignItems: "center", justifyContent: "center" },
  retryButtonText: { fontFamily: fonts.semibold, color: colors.white, fontSize: 14 },
  header: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.sm, borderBottomWidth: 1, borderColor: colors.sand, backgroundColor: colors.cream },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  brandTitle: { fontSize: 26, fontFamily: fonts.display, color: colors.ink },
  searchRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  filterButton: { width: 46, height: 46, borderRadius: radius.control, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.sand, alignItems: "center", justifyContent: "center" },
  filterButtonOpen: { backgroundColor: colors.coral, borderColor: colors.coral },
  badge: { position: "absolute", top: -4, right: -4, minWidth: 18, height: 18, paddingHorizontal: 4, borderRadius: 9, backgroundColor: colors.coral, borderWidth: 2, borderColor: colors.cream, alignItems: "center", justifyContent: "center" },
  badgeText: { fontFamily: fonts.semibold, fontSize: 10, color: colors.white },
  searchBarWrap: { flex: 1 },
  toggleViewButton: { width: 46, height: 46, borderRadius: radius.control, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.sand, alignItems: "center", justifyContent: "center" },
  filterPanel: { marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.sand },
  filterSection: { marginBottom: spacing.sm },
  filterSectionLabel: { fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 0.8, textTransform: "uppercase", color: colors.slate, marginBottom: 6 },
  chipRowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.pill, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.sand },
  chipActive: { backgroundColor: colors.coral, borderColor: colors.coral },
  amenityChipActive: { backgroundColor: colors.teal, borderColor: colors.teal },
  chipText: { fontFamily: fonts.body, fontSize: 12, color: colors.slate },
  chipTextActive: { fontFamily: fonts.semibold, color: colors.white },
  amenityScroll: { maxHeight: 120 },
  amenityScrollContent: { paddingRight: spacing.xs },
  filterFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: spacing.sm, marginTop: spacing.xs, borderTopWidth: 1, borderTopColor: colors.sand, gap: spacing.sm },
  clearButton: { paddingVertical: spacing.xs, paddingHorizontal: spacing.xs },
  clearButtonText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.slate, textDecorationLine: "underline" },
  clearButtonTextDisabled: { color: colors.sand, textDecorationLine: "none" },
  doneButton: { flex: 1, maxWidth: 220, height: 44, backgroundColor: colors.coral, borderRadius: radius.control, alignItems: "center", justifyContent: "center" },
  doneButtonText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.white },
  map: { flex: 1, width: "100%", height: "100%" },
  emptyFeed: { alignItems: "center", marginTop: 40, gap: spacing.sm, paddingHorizontal: spacing.lg },
  emptyFeedText: { color: colors.slate, fontSize: 14, fontFamily: fonts.body, textAlign: "center" },
  card: { backgroundColor: colors.white, marginHorizontal: spacing.md, marginTop: spacing.md, borderRadius: radius.card, borderWidth: 1, borderColor: colors.sand, overflow: "hidden", ...shadow },
  imageFrame: { height: 150, backgroundColor: colors.cream, position: "relative" },
  cardImage: { width: "100%", height: "100%", borderTopLeftRadius: radius.card, borderTopRightRadius: radius.card },
  pricePill: { position: "absolute", top: 12, left: 12, backgroundColor: colors.white, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.sand },
  priceText: { fontSize: 15, fontFamily: fonts.bold, color: colors.ink },
  perNight: { fontSize: 11, fontFamily: fonts.body, color: colors.slate },
  details: { padding: spacing.md },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  title: { flex: 1, marginRight: spacing.sm, fontSize: 18, fontFamily: fonts.display, color: colors.ink },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4, paddingTop: 4 },
  ratingText: { fontSize: 13, fontFamily: fonts.semibold, color: colors.ink },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  locationText: { fontSize: 13, fontFamily: fonts.body, color: colors.slate },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.sand },
  tagText: { fontSize: 11, fontFamily: fonts.body, color: colors.slate },
  divider: { height: 1, backgroundColor: colors.sand, marginVertical: 12 },
  viewDetails: { fontSize: 14, fontFamily: fonts.semibold, color: colors.coral, textAlign: "center" },
});