import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

interface Guesthouse {
  id: string;
  name: string;
  location: string;
  pricePerNight: number;
  availableRooms: number;
  rating: number;
  description: string;
  image: string;
  isFeatured?: boolean;
}

const COLORS = {
  primary: "#111111",
  orange: "#FF6B00",
  blue: "#0077ED",
  red: "#E53935",
  yellow: "#FFD400",
  background: "#F5F5F5",
  white: "#FFFFFF",
  gray: "#6B6B6B",
  border: "#E0E0E0",
};

function MainApp() {
  const [searchQuery, setSearchQuery] = useState("");
  const [budgetOnly, setBudgetOnly] = useState(false);
  const [sortByAvailability, setSortByAvailability] = useState(false);

  const [guesthouses] = useState<Guesthouse[]>([
    {
      id: "1",
      name: "Serowe Serene Stay",
      location: "Serowe",
      pricePerNight: 450,
      availableRooms: 3,
      rating: 4.7,
      description:
        "A comfortable and peaceful guesthouse ideal for students, families and business travellers.",
      image:
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80",
      isFeatured: true,
    },
    {
      id: "2",
      name: "Palapye Luxury Oasis",
      location: "Palapye",
      pricePerNight: 750,
      availableRooms: 5,
      rating: 4.9,
      description:
        "Modern accommodation with spacious rooms and a relaxing environment in Palapye.",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
      isFeatured: true,
    },
    {
      id: "3",
      name: "Gaborone Central Inn",
      location: "Gaborone",
      pricePerNight: 380,
      availableRooms: 2,
      rating: 4.5,
      description:
        "Affordable and conveniently located accommodation close to central Gaborone.",
      image:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80",
      isFeatured: false,
    },
    {
      id: "4",
      name: "Maun Safari Lodge",
      location: "Maun",
      pricePerNight: 1200,
      availableRooms: 4,
      rating: 4.9,
      description:
        "A premium stay for visitors exploring Maun and the surrounding safari attractions.",
      image:
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80",
      isFeatured: true,
    },
    {
      id: "5",
      name: "Kasane Riverfront Cabin",
      location: "Kasane",
      pricePerNight: 950,
      availableRooms: 1,
      rating: 4.8,
      description:
        "A beautiful riverside accommodation offering a peaceful stay in Kasane.",
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
      isFeatured: true,
    },
  ]);

  const featuredProperties = guesthouses.filter((item) => item.isFeatured);

  const filteredGuesthouses = guesthouses.filter((item) => {
    const search = searchQuery.toLowerCase().trim();

    const matchesSearch =
      item.name.toLowerCase().includes(search) ||
      item.location.toLowerCase().includes(search);

    const matchesBudget = budgetOnly ? item.pricePerNight <= 500 : true;

    return matchesSearch && matchesBudget;
  });

  const finalDisplayData = sortByAvailability
    ? [...filteredGuesthouses].sort(
        (a, b) => b.availableRooms - a.availableRooms,
      )
    : filteredGuesthouses;

  const resetFilters = () => {
    setSearchQuery("");
    setBudgetOnly(false);
    setSortByAvailability(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>B</Text>
          </View>

          <View>
            <Text style={styles.headerTitle}>BOOKaCRIB</Text>
            <Text style={styles.headerSubtitle}>Find your next stay</Text>
          </View>
        </View>

        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search guesthouse or location..."
            placeholderTextColor="#888888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery("")}
            >
              <Text style={styles.clearText}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* FILTERS */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              budgetOnly && styles.filterButtonActive,
            ]}
            onPress={() => setBudgetOnly(!budgetOnly)}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.filterText, budgetOnly && styles.filterTextActive]}
            >
              Budget ≤ P500
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              sortByAvailability && styles.filterButtonActiveBlue,
            ]}
            onPress={() => setSortByAvailability(!sortByAvailability)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterText,
                sortByAvailability && styles.filterTextActiveBlue,
              ]}
            >
              High Availability
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENT */}
      <FlatList
        data={finalDisplayData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          searchQuery.length === 0 && !budgetOnly && !sortByAvailability ? (
            <View>
              {/* FEATURED */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Featured Stays</Text>

                <View style={styles.orangeLine} />
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredScroll}
              >
                {featuredProperties.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.featuredCard}
                    activeOpacity={0.9}
                  >
                    {/* CLEAN IMAGE */}
                    <Image
                      source={{ uri: item.image }}
                      style={styles.featuredImage}
                    />

                    {/* INFORMATION BELOW IMAGE */}
                    <View style={styles.featuredInfo}>
                      <View style={styles.featuredTitleRow}>
                        <View style={styles.featuredNameContainer}>
                          <Text style={styles.featuredTitle} numberOfLines={1}>
                            {item.name}
                          </Text>

                          <Text style={styles.featuredLocation}>
                            {item.location}, Botswana
                          </Text>
                        </View>

                        {/* SIMPLE RATING */}
                        <View style={styles.ratingBox}>
                          <Text style={styles.ratingStar}>★</Text>
                          <Text style={styles.ratingText}>{item.rating}</Text>
                        </View>
                      </View>

                      <Text
                        style={styles.featuredDescription}
                        numberOfLines={2}
                      >
                        {item.description}
                      </Text>

                      <View style={styles.featuredBottom}>
                        <View>
                          <Text style={styles.priceLabel}>FROM</Text>

                          <Text style={styles.featuredPrice}>
                            P{item.pricePerNight}
                            <Text style={styles.nightText}> / night</Text>
                          </Text>
                        </View>

                        <View style={styles.orangeArrow}>
                          <Text style={styles.arrowText}>→</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* ALL STAYS */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>All Available Stays</Text>

                <View style={styles.blueLine} />
              </View>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.9}>
            {/* CLEAN IMAGE */}
            <Image source={{ uri: item.image }} style={styles.cardImage} />

            <View style={styles.cardContent}>
              <View style={styles.cardTitleRow}>
                <View style={styles.cardNameContainer}>
                  <Text style={styles.cardTitle}>{item.name}</Text>

                  <Text style={styles.cardLocation}>
                    {item.location}, Botswana
                  </Text>
                </View>

                <View style={styles.cardRating}>
                  <Text style={styles.ratingStar}>★</Text>
                  <Text style={styles.cardRatingText}>{item.rating}</Text>
                </View>
              </View>

              <Text style={styles.cardDescription} numberOfLines={2}>
                {item.description}
              </Text>

              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.priceLabel}>PRICE PER NIGHT</Text>

                  <Text style={styles.cardPrice}>P{item.pricePerNight}</Text>
                </View>

                <View style={styles.availabilityContainer}>
                  <View
                    style={[
                      styles.availabilityDot,
                      {
                        backgroundColor:
                          item.availableRooms <= 2 ? COLORS.red : COLORS.blue,
                      },
                    ]}
                  />

                  <Text
                    style={[
                      styles.cardAvailability,
                      {
                        color:
                          item.availableRooms <= 2 ? COLORS.red : COLORS.blue,
                      },
                    ]}
                  >
                    {item.availableRooms}{" "}
                    {item.availableRooms === 1 ? "room" : "rooms"} left
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>?</Text>
            </View>

            <Text style={styles.emptyTitle}>No stays found</Text>

            <Text style={styles.emptyText}>
              Try changing your search or filters to find available guesthouses.
            </Text>

            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
              <Text style={styles.resetButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  /* =========================
     HEADER
  ========================= */

  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  logoBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: COLORS.orange,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  logoText: {
    fontSize: 25,
    fontWeight: "900",
    color: COLORS.white,
  },

  headerTitle: {
    fontSize: 23,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: 1,
  },

  headerSubtitle: {
    fontSize: 12,
    color: "#D0D0D0",
    marginTop: 1,
  },

  /* =========================
     SEARCH
  ========================= */

  searchContainer: {
    position: "relative",
  },

  searchInput: {
    height: 48,
    backgroundColor: COLORS.white,
    borderRadius: 9,
    paddingHorizontal: 15,
    paddingRight: 45,
    fontSize: 14,
    color: COLORS.primary,
  },

  clearButton: {
    position: "absolute",
    right: 12,
    top: 11,
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
  },

  clearText: {
    fontSize: 25,
    color: COLORS.gray,
    lineHeight: 25,
  },

  /* =========================
     FILTERS
  ========================= */

  filterRow: {
    flexDirection: "row",
    marginTop: 12,
  },

  filterButton: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#444444",
    backgroundColor: "#222222",
    marginRight: 8,
  },

  filterButtonActive: {
    backgroundColor: COLORS.orange,
    borderColor: COLORS.orange,
  },

  filterButtonActiveBlue: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue,
  },

  filterText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: "600",
  },

  filterTextActive: {
    color: COLORS.white,
  },

  filterTextActiveBlue: {
    color: COLORS.white,
  },

  /* =========================
     LIST
  ========================= */

  listContent: {
    paddingBottom: 30,
  },

  sectionHeader: {
    paddingHorizontal: 18,
    marginTop: 22,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.primary,
  },

  orangeLine: {
    width: 45,
    height: 4,
    backgroundColor: COLORS.orange,
    marginTop: 7,
    borderRadius: 2,
  },

  blueLine: {
    width: 45,
    height: 4,
    backgroundColor: COLORS.blue,
    marginTop: 7,
    borderRadius: 2,
  },

  /* =========================
     FEATURED CARDS
  ========================= */

  featuredScroll: {
    paddingLeft: 18,
    paddingRight: 6,
  },

  featuredCard: {
    width: 285,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    marginRight: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  featuredImage: {
    width: "100%",
    height: 165,
    backgroundColor: "#DDDDDD",
  },

  featuredInfo: {
    padding: 14,
  },

  featuredTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  featuredNameContainer: {
    flex: 1,
    marginRight: 8,
  },

  featuredTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.primary,
  },

  featuredLocation: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },

  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF4D1",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },

  ratingStar: {
    color: "#D99A00",
    fontSize: 12,
    fontWeight: "900",
  },

  ratingText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 3,
  },

  featuredDescription: {
    color: COLORS.gray,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 9,
  },

  featuredBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 13,
  },

  priceLabel: {
    fontSize: 9,
    color: COLORS.gray,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  featuredPrice: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: "900",
    marginTop: 2,
  },

  nightText: {
    fontSize: 11,
    color: COLORS.gray,
    fontWeight: "500",
  },

  orangeArrow: {
    width: 37,
    height: 37,
    borderRadius: 19,
    backgroundColor: COLORS.orange,
    justifyContent: "center",
    alignItems: "center",
  },

  arrowText: {
    color: COLORS.white,
    fontSize: 21,
    fontWeight: "800",
  },

  /* =========================
     NORMAL CARDS
  ========================= */

  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 18,
    marginBottom: 14,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  cardImage: {
    width: "100%",
    height: 175,
    backgroundColor: "#DDDDDD",
  },

  cardContent: {
    padding: 15,
  },

  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  cardNameContainer: {
    flex: 1,
    marginRight: 10,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
  },

  cardLocation: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 5,
  },

  cardRating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF4D1",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },

  cardRatingText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
    marginLeft: 3,
  },

  cardDescription: {
    color: COLORS.gray,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 15,
    paddingTop: 13,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },

  cardPrice: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: "900",
    marginTop: 2,
  },

  availabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  cardAvailability: {
    fontSize: 12,
    fontWeight: "700",
  },

  /* =========================
     EMPTY STATE
  ========================= */

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 35,
    marginTop: 70,
  },

  emptyIcon: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: COLORS.orange,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  emptyIconText: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "900",
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 7,
  },

  emptyText: {
    textAlign: "center",
    color: COLORS.gray,
    fontSize: 14,
    lineHeight: 21,
  },

  resetButton: {
    backgroundColor: COLORS.orange,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 7,
    marginTop: 18,
  },

  resetButtonText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 13,
  },
});

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}
