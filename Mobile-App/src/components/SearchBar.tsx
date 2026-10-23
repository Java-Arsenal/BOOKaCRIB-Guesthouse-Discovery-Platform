import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius } from "../theme/theme";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onClear: () => void;
  onFilterPress?: () => void;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  onClear,
  onFilterPress,
}: SearchBarProps) {
  return (
    <View style={styles.box}>
      <Ionicons name="location-outline" size={18} color={colors.slate} />
      <TextInput
        style={styles.input}
        placeholder="Search guesthouse or location..."
        placeholderTextColor={colors.slate}
        value={searchQuery}
        onChangeText={onSearchChange}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={onClear} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color={colors.slate} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={onFilterPress}
        hitSlop={8}
        style={styles.filter}
      >
        <Ionicons name="options-outline" size={20} color={colors.ink} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    paddingHorizontal: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.sand,
    borderRadius: radius.pill,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    fontFamily: fonts.body,
    color: colors.ink,
  },
  filter: { marginLeft: 10 },
});
