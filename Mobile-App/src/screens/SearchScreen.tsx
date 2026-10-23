import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import SearchBar from "../components/SearchBar";
import { colors, fonts, radius, spacing, shadow } from "../theme/theme";

export interface Guesthouse {
  id: string;
  name: string;
  location: string;
  pricePerNight: number;
  availableRooms: number;
  rating: number;
  reviewsCount?: number;
  description: string;
  amenities: string[];
}

const SORTS: {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  summary: string;
}[] = [
  {
    key: "cheapest",
    label: "Cheapest First",
    icon: "swap-vertical",
    summary: "Sorted by price (cheapest first)",
  },
  {
    key: "rated",
    label: "Top Rated",
    icon: "star",
    summary: "Sorted by rating (top rated)",
  },
  {
    key: "wifi",
    label: "Wi-Fi included",
    icon: "wifi",
    summary: "Showing Wi-Fi included",
  },
];

const CITIES = [
  { key: "all", label: "All Cities" },
  { key: "gaborone", label: "Gaborone" },
  { key: "palapye", label: "Palapye" },
];

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
              {item.rating} ({item.reviewsCount || 12})
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

const ENHANCED_DATA: Guesthouse[] = [
  {
    id: "1",
    name: "Acacia Student & Guest Lodge",
    location: "Palapye",
    pricePerNight: 280,
    availableRooms: 4,
    rating: 4.3,
    reviewsCount: 19,
    description: "Affordable accommodation tailor-made for students.",
    amenities: ["📶 Free WiFi", "🪑 Desk", "🍳 Kitchenette"],
  },
  {
    id: "2",
    name: "Mokolodi Haven Retreat",
    location: "Gaborone",
    pricePerNight: 340,
    availableRooms: 2,
    rating: 4.9,
    reviewsCount: 42,
    description: "Handpicked cozy stay ready for fast booking.",
    amenities: ["📶 Fast Wi-Fi", "❄️ AC", "🅿️ Free Parking"],
  },
  {
    id: "3",
    name: "Serenity Palms Guesthouse",
    location: "Gaborone Central",
    pricePerNight: 420,
    availableRooms: 5,
    rating: 4.85,
    reviewsCount: 38,
    description: "Lush courtyard garden and private plunge pool.",
    amenities: ["📶 WiFi", "❄️ Aircon", "☀️ Solar Backup"],
  },
];

export default function SearchScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("cheapest");
  const [selectedCity, setSelectedCity] = useState("all");

  let processedData = ENHANCED_DATA.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (selectedCity !== "all") {
    processedData = processedData.filter((item) =>
      item.location.toLowerCase().includes(selectedCity),
    );
  }

  if (activeFilter === "wifi") {
    processedData = processedData.filter((item) =>
      item.amenities.some(
        (a) =>
          a.toLowerCase().includes("wi-fi") || a.toLowerCase().includes("wifi"),
      ),
    );
  }

  if (activeFilter === "cheapest") {
    processedData.sort((a, b) => a.pricePerNight - b.pricePerNight);
  } else if (activeFilter === "rated") {
    processedData.sort((a, b) => b.rating - a.rating);
  }

  const region =
    selectedCity !== "all"
      ? selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)
      : "Botswana";
  const summary = `${SORTS.find((s) => s.key === activeFilter)?.summary} · ${processedData.length} results in ${region}`;

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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
        >
          {SORTS.map((s) => {
            const active = activeFilter === s.key;
            return (
              <TouchableOpacity
                key={s.key}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setActiveFilter(s.key)}
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

        <View style={styles.cityRow}>
          {CITIES.map((c) => {
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
        </View>
      </View>

      <FlatList
        data={processedData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
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

  cityRow: { flexDirection: "row", marginTop: 12 },
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

  emptyFeed: { alignItems: "center", marginTop: 40 },
  emptyFeedText: { color: colors.slate, fontSize: 14, fontFamily: fonts.body },

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
