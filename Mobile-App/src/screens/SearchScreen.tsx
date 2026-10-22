// src/screens/SearchScreen.tsx
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

import SearchBar from "../components/SearchBar";

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

// 👑 CLEANED UP CARD: Amenities have been removed to keep the card uniform and tidy.
function SearchResultCard({
  item,
  onPress,
}: {
  item: Guesthouse;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.imageMockFrame}>
        <View style={styles.pricePill}>
          <Text style={styles.priceText}>
            P{item.pricePerNight} <Text style={styles.perNight}>/ night</Text>
          </Text>
        </View>
      </View>
      <View style={styles.textDetailsContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.propertyTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.ratingText}>
            ⭐ {item.rating} ({item.reviewsCount || 12})
          </Text>
        </View>
        <Text style={styles.locationText}>📍 {item.location}, Botswana</Text>

        <View style={styles.actionDividerLine} />
        <Text style={styles.viewDetailsLink}>
          View Details & Contact Host ➔
        </Text>
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

  let processedData = ENHANCED_DATA.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (selectedCity !== "all") {
    processedData = processedData.filter((item) =>
      item.location.toLowerCase().includes(selectedCity),
    );
  }

  if (activeFilter === "wifi") {
    processedData = processedData.filter((item) =>
      item.amenities.some(
        (amenity) =>
          amenity.toLowerCase().includes("wi-fi") ||
          amenity.toLowerCase().includes("wifi"),
      ),
    );
  }

  if (activeFilter === "cheapest") {
    processedData.sort((a, b) => a.pricePerNight - b.pricePerNight);
  } else if (activeFilter === "rated") {
    processedData.sort((a, b) => b.rating - a.rating);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.brandTitle}>BOOKaCRIB</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Text style={styles.profileLink}>Profile</Text>
          </TouchableOpacity>
        </View>
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={(text) => setSearchQuery(text)}
          onClear={() => setSearchQuery("")}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
        >
          <TouchableOpacity
            style={[
              styles.chip,
              activeFilter === "cheapest" && styles.chipActive,
            ]}
            onPress={() => setActiveFilter("cheapest")}
          >
            <Text
              style={
                activeFilter === "cheapest"
                  ? styles.chipTextActive
                  : styles.chipTextInactive
              }
            >
              Cheapest First
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, activeFilter === "rated" && styles.chipActive]}
            onPress={() => setActiveFilter("rated")}
          >
            <Text
              style={
                activeFilter === "rated"
                  ? styles.chipTextActive
                  : styles.chipTextInactive
              }
            >
              ⭐ Top Rated
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, activeFilter === "wifi" && styles.chipActive]}
            onPress={() => setActiveFilter("wifi")}
          >
            <Text
              style={
                activeFilter === "wifi"
                  ? styles.chipTextActive
                  : styles.chipTextInactive
              }
            >
              🛜 Wi-Fi included
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.cityContainerRow}>
          <TouchableOpacity
            style={[
              styles.cityBadge,
              selectedCity === "all" && styles.cityBadgeActive,
            ]}
            onPress={() => setSelectedCity("all")}
          >
            <Text
              style={
                selectedCity === "all"
                  ? styles.cityTextActive
                  : styles.cityTextInactive
              }
            >
              All Cities
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.cityBadge,
              selectedCity === "gaborone" && styles.cityBadgeActive,
            ]}
            onPress={() => setSelectedCity("gaborone")}
          >
            <Text
              style={
                selectedCity === "gaborone"
                  ? styles.cityTextActive
                  : styles.cityTextInactive
              }
            >
              Gaborone
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.cityBadge,
              selectedCity === "palapye" && styles.cityBadgeActive,
            ]}
            onPress={() => setSelectedCity("palapye")}
          >
            <Text
              style={
                selectedCity === "palapye"
                  ? styles.cityTextActive
                  : styles.cityTextInactive
              }
            >
              Palapye
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={processedData}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Text style={styles.resultsCounterLabel}>
            {selectedCity !== "all"
              ? `Showing stays in ${selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}`
              : "All regions in Botswana"}
            {" · "}
            {processedData.length} options found
          </Text>
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
  container: { flex: 1, backgroundColor: "#ffffff" },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#f1f3f4",
    backgroundColor: "#ffffff",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#202124",
    letterSpacing: -0.5,
  },
  profileLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a73e8",
  },
  filterScrollView: { flexDirection: "row", marginTop: 12, marginBottom: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f3f4",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  chipActive: { backgroundColor: "#e8f0fe", borderColor: "#1a73e8" },
  chipTextActive: { color: "#1a73e8", fontWeight: "600", fontSize: 13 },
  chipTextInactive: { color: "#3c4043", fontSize: 13 },
  cityContainerRow: {
    flexDirection: "row",
    marginTop: 4,
    alignItems: "center",
  },
  cityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 6,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cityBadgeActive: { backgroundColor: "#202124", borderColor: "#202124" },
  cityTextActive: { color: "#ffffff", fontWeight: "600", fontSize: 12 },
  cityTextInactive: { color: "#5f6368", fontSize: 12, fontWeight: "500" },
  resultsCounterLabel: {
    fontSize: 13,
    color: "#5f6368",
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 10,
    fontWeight: "500",
  },
  emptyFeed: { alignItems: "center", marginTop: 40 },
  emptyFeedText: { color: "#70757a", fontSize: 14 },

  cardContainer: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
    elevation: 2,
  },
  imageMockFrame: { height: 140, backgroundColor: "#f1f3f4", padding: 12 },
  pricePill: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  priceText: { fontSize: 15, fontWeight: "700", color: "#202124" },
  perNight: { fontSize: 11, fontWeight: "400", color: "#5f6368" },
  textDetailsContainer: { padding: 16 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#202124",
    flex: 1,
    marginRight: 8,
  },
  ratingText: { fontSize: 13, fontWeight: "600", color: "#3c4043" },
  locationText: { fontSize: 13, color: "#5f6368", marginBottom: 4 },
  actionDividerLine: {
    height: 1,
    backgroundColor: "#f1f3f4",
    marginVertical: 12,
  },
  viewDetailsLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a73e8",
    textAlign: "center",
  },
});