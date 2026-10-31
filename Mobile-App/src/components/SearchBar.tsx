import React from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, spacing } from "../theme/theme";

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
    <View style={s.container}>
      <Ionicons
        name="search-outline"
        size={20}
        color={colors.slate}
        style={s.leftIcon}
      />
      <TextInput
        style={s.input}
        placeholder="Search guesthouses..."
        placeholderTextColor={colors.slate}
        value={searchQuery}
        onChangeText={onSearchChange}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity
          onPress={onClear}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={s.clearButton}
        >
          <Ionicons name="close-circle" size={18} color={colors.slate} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.sand,
    borderRadius: radius.control,
    height: 46,
    paddingHorizontal: spacing.md,
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    height: "100%",
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
    paddingVertical: 0, // removes default Android padding
  },
  clearButton: {
    marginLeft: spacing.sm,
    padding: 4,
  },
});