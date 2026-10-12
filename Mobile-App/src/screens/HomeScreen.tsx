// src/screens/HomeScreen.tsx
import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Cross-Module Folder Configuration Imports
import { searchStyles as styles } from "../theme/searchStyles";
import { INITIAL_GUESTHOUSES, Guesthouse } from "../dev/guesthouseData";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [budgetOnly, setBudgetOnly] = useState(false);
  const [sortByAvailability, setSortByAvailability] = useState(false);
  const [guesthouses] = useState<Guesthouse[]>(INITIAL_GUESTHOUSES);

  const featuredProperties = guesthouses.filter((item) => item.isFeatured);

  const filteredGuesthouses = guesthouses.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBudget = budgetOnly ? item.pricePerNight <= 500 : true;
    return matchesSearch && matchesBudget;
  });

  const finalDisplayData = sortByAvailability
    ? [...filteredGuesthouses].sort(
        (a, b) => b.availableRooms - a.availableRooms,
      )
    : filteredGuesthouses;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>BOOKaCRIB</Text>
        <Text style={styles.headerSubtitle}>
          Find your perfect guesthouse stay
        </Text>

        <View style={styles.searchRow}>
          <View style={styles.searchBoxContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search guesthouse or location..."
              placeholderTextColor="#888888"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearchQuery("")}
              >
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterChip, budgetOnly && styles.filterChipActive]}
            onPress={() => setBudgetOnly(!budgetOnly)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterChipText,
                budgetOnly && styles.filterChipTextActive,
              ]}
            >
              💰 Budget-friendly (≤ P500)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              sortByAvailability && styles.filterChipActive,
              { marginLeft: 8 },
            ]}
            onPress={() => setSortByAvailability(!sortByAvailability)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterChipText,
                sortByAvailability && styles.filterChipTextActive,
              ]}
            >
              🔥 High Availability
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={finalDisplayData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          searchQuery.length === 0 && !budgetOnly && !sortByAvailability ? (
            <View style={styles.featuredSection}>
              <Text style={styles.sectionTitle}>
                ⭐ Featured Recommendations
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredScrollContent}
              >
                {featuredProperties.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.featuredCard}
                    activeOpacity={0.8}
                  >
                    <View style={styles.featuredCardImagePlaceholder}>
                      <Text style={styles.featuredCardMapPin}>
                        📍 {item.location}
                      </Text>
                    </View>
                    <Text style={styles.featuredCardTitle} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.featuredCardPrice}>
                      P{item.pricePerNight} / night
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text style={styles.sectionTitle}>📋 All Available Stays</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.7}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>⭐ 4.5</Text>
              </View>
            </View>

            <Text style={styles.cardLocation}>
              📍 {item.location}, Botswana
            </Text>

            <View style={styles.cardFooter}>
              <Text style={styles.cardPrice}>
                P{item.pricePerNight}{" "}
                <Text style={styles.perNight}>/ night</Text>
              </Text>
              <Text
                style={[
                  styles.cardAvailability,
                  { color: item.availableRooms <= 2 ? "#d32f2f" : "#188038" },
                ]}
              >
                {item.availableRooms} rooms left
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No properties match your browse filters.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
