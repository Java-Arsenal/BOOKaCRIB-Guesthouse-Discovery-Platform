// src/components/SearchBar.tsx
import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onClear: () => void;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  onClear,
}: SearchBarProps) {
  return (
    <View style={styles.searchRow}>
      <View style={styles.searchBoxContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search guesthouse or location..."
          placeholderTextColor="#888888"
          value={searchQuery}
          onChangeText={onSearchChange}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={onClear}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: { flexDirection: "row", alignItems: "center" },
  searchBoxContainer: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
  },
  searchInput: {
    height: 46,
    borderWidth: 1,
    borderColor: "#dadce0",
    borderRadius: 8,
    paddingLeft: 16,
    paddingRight: 40,
    backgroundColor: "#f1f3f4",
    fontSize: 15,
    color: "#202124",
  },
  clearButton: { position: "absolute", right: 12, padding: 4 },
  clearButtonText: { color: "#70757a", fontSize: 16, fontWeight: "bold" },
});
