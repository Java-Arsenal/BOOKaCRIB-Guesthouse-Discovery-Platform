import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { apiGet, apiRequest } from "../api/client"; // Added apiRequest
import FavoriteButton from "../components/FavoriteButton";
import { useFavorites } from "../context/FavoritesContext";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { colors, fonts, radius, shadow, spacing } from "../theme/theme";

interface Rating {
  rating_id: string;
  guesthouse_id: string;
  guesthouse_name?: string;
  city?: string;
  score: number;
  comment?: string;
}

export default function MyRatingsScreen({ navigation }: any) {
  const { user } = useCurrentUser();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRatings = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet("/ratings/me");
      setRatings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Could not load your ratings.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRatings();
    }, [user])
  );

  const handleDelete = (guesthouseId: string) => {
    Alert.alert(
      "Delete Rating",
      "Are you sure you want to remove your rating for this guesthouse?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await user?.getIdToken();
              await apiRequest(`/ratings/${guesthouseId}`, { method: "DELETE" }, token);
              setRatings((prev) => prev.filter((r) => r.guesthouse_id !== guesthouseId));
            } catch (err) {
              Alert.alert("Error", "Failed to delete rating.");
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Please log in to see your ratings.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.coral} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={ratings}
        keyExtractor={(item) => item.rating_id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name="star-outline" size={42} color={colors.slate} />
            <Text style={styles.title}>No ratings yet</Text>
            <Text style={styles.message}>Rate a guesthouse you've visited to see it here.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.guesthouse_name || "Unknown Guesthouse"}</Text>
                <Text style={styles.meta}>{item.city || "Botswana"}</Text>
              </View>
              <View style={styles.scoreRow}>
                <Ionicons name="star" size={16} color={colors.gold} />
                <Text style={styles.score}>{item.score}.0</Text>
              </View>
              <Pressable onPress={() => handleDelete(item.guesthouse_id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={20} color={colors.error} />
              </Pressable>
            </View>
            {item.comment ? (
              <Text style={styles.comment}>"{item.comment}"</Text>
            ) : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  list: { padding: spacing.md, gap: spacing.md, flexGrow: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg },
  title: { fontFamily: fonts.display, fontSize: 20, color: colors.ink, marginTop: spacing.sm },
  message: { fontFamily: fonts.body, fontSize: 14, color: colors.slate, textAlign: "center", marginTop: spacing.xs },
  card: { backgroundColor: colors.white, borderRadius: radius.card, padding: spacing.md, ...shadow, borderWidth: 1, borderColor: colors.sand },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  name: { fontFamily: fonts.semibold, fontSize: 16, color: colors.ink },
  meta: { fontFamily: fonts.body, fontSize: 13, color: colors.slate, marginTop: 2 },
  scoreRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  score: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  deleteBtn: { padding: 8, marginLeft: 4 },
  comment: { fontFamily: fonts.body, fontSize: 14, color: colors.slate, fontStyle: "italic", marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.sand },
});