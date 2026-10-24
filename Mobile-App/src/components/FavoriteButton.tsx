import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFavorites } from "../context/FavoritesContext";
import { colors } from "../theme/theme";

interface FavoriteButtonProps {
  guesthouseId: string;
  onRequireLogin?: () => void;
}

export default function FavoriteButton({
  guesthouseId,
  onRequireLogin,
}: FavoriteButtonProps) {
  const { favoriteIds, isAuthenticated, toggleFavorite } = useFavorites();
  const [busy, setBusy] = useState(false);
  const isFavorite = favoriteIds.includes(guesthouseId);

  const onPress = async () => {
    if (!isAuthenticated) {
      if (onRequireLogin) onRequireLogin();
      else Alert.alert("Log in required", "Log in to save guesthouses.");
      return;
    }

    setBusy(true);
    try {
      await toggleFavorite(guesthouseId);
    } catch (error) {
      Alert.alert(
        "Could not update favourites",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        isFavorite ? "Remove from favourites" : "Add to favourites"
      }
      accessibilityState={{ selected: isFavorite, disabled: busy }}
      disabled={busy}
      onPress={() => void onPress()}
      style={styles.button}
      hitSlop={8}
    >
      {busy ? (
        <ActivityIndicator size="small" color={colors.coral} />
      ) : (
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={21}
          color={isFavorite ? colors.coral : colors.ink}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.sand,
  },
});