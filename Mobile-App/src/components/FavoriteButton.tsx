import React, { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFavorites } from "../context/FavoritesContext";
import { colors } from "../theme/theme";
import type { RootStackParamList } from "../navigation/RootNavigator";

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface FavoriteButtonProps {
  guesthouseId: string;
  /**
   * Optional override for the login prompt. If not provided, the button
   * navigates directly to the Login screen when tapped while logged out.
   */
  onRequireLogin?: () => void;
}

export default function FavoriteButton({
  guesthouseId,
  onRequireLogin,
}: FavoriteButtonProps) {
  const navigation = useNavigation<Nav>();
  const { favoriteIds, isAuthenticated, toggleFavorite } = useFavorites();
  const [busy, setBusy] = useState(false);
  const isFavorite = favoriteIds.includes(guesthouseId);

  const onPress = async () => {
    if (!isAuthenticated) {
      // Prefer the parent-supplied handler if given (e.g. FavoritesScreen
      // passes navigation.navigate("Login")). Otherwise fall back to a
      // direct navigation so the button always does the right thing,
      // even when rendered from SearchScreen / GuesthouseDetailScreen
      // which don't pass onRequireLogin.
      if (onRequireLogin) onRequireLogin();
      else navigation.navigate("Login");
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