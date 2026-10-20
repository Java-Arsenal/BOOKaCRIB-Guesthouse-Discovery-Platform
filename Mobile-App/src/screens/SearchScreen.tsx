// src/screens/SearchScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SearchBar from "../components/SearchBar";
import GuesthouseCard, { Guesthouse } from "../components/GuesthouseCard";

// Temporary local data array mapping Botswana guesthouses
const DATA: Guesthouse[] = [
  {
    id: "1",
    name: "Gaborone Central Inn",
    location: "Gaborone",
    pricePerNight: 380,
    availableRooms: 2,
    rating: 4.2,
    description: "Affordable city living.",
    amenities: ["📶 Free Wi-Fi"],
  },
  {
    id: "2",
    name: "Serowe Serene Stay",
    location: "Serowe",
    pricePerNight: 450,
    availableRooms: 3,
    rating: 4.5,
    description: "Tranquil escape in Serowe.",
    amenities: ["📶 Free Wi-Fi"],
  },
  {
    id: "3",
    name: "Palapye Luxury Oasis",
    location: "Palapye",
    pricePerNight: 750,
    availableRooms: 5,
    rating: 4.8,
    description: "Premium suites near BIUST.",
    amenities: ["📶 Free Wi-Fi"],
  },
];

export default function SearchScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [budgetOnly, setBudgetOnly] = useState(false);

  const filteredData = DATA.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBudget = budgetOnly ? item.pricePerNight <= 500 : true;
    return matchesSearch && matchesBudget;
  });

  // CRITICAL FIX ISSUE #22: Sort ascending (Cheapest First) by default
  const sortedAndFilteredData = [...filteredData].sort(
    (a, b) => a.pricePerNight - b.pricePerNight,
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BOOKaCRIB</Text>
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={(text) => setSearchQuery(text)}
          onClear={() => setSearchQuery("")}
        />
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterChip, budgetOnly && styles.filterChipActive]}
            onPress={() => setBudgetOnly(!budgetOnly)}
          >
            <Text style={budgetOnly ? styles.textActive : styles.textInactive}>
              Under P500 Only
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={sortedAndFilteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GuesthouseCard
            item={item}
            onPress={() =>
              navigation.navigate("GuesthouseDetailScreen", {
                guesthouse: item,
              })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#e9ecef",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a73e8",
    marginBottom: 12,
  },
  filterRow: { flexDirection: "row", marginTop: 12 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f3f4",
  },
  filterChipActive: {
    backgroundColor: "#e8f0fe",
    borderWidth: 1,
    borderColor: "#1a73e8",
  },
  textActive: { color: "#1a73e8", fontWeight: "600" },
  textInactive: { color: "#3c4043" },
});
