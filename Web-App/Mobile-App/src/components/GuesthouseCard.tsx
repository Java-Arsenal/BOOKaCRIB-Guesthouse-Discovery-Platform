// src/components/GuesthouseCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export interface Guesthouse {
  id: string;
  name: string;
  location: string;
  pricePerNight: number;
  availableRooms: number;
  isFeatured?: boolean;
  rating: number;
  description: string;
  amenities: string[];
}

interface GuesthouseCardProps {
  item: Guesthouse;
  onPress: () => void;
}

export default function GuesthouseCard({ item, onPress }: GuesthouseCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>⭐ {item.rating}</Text>
        </View>
      </View>

      <Text style={styles.cardLocation}>
        Location: {item.location}, Botswana
      </Text>

      <View style={styles.cardFooter}>
        <Text style={styles.cardPrice}>
          P{item.pricePerNight} <Text style={styles.perNight}>/ night</Text>
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
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e8eaed",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#202124",
    flex: 1,
    marginRight: 8,
  },
  badge: {
    backgroundColor: "#fef7e0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: { fontSize: 12, fontWeight: "600", color: "#b06000" },
  cardLocation: { fontSize: 14, color: "#5f6368", marginTop: 6 },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "#f1f3f4",
  },
  cardPrice: { fontSize: 18, color: "#188038", fontWeight: "700" },
  perNight: { fontSize: 12, color: "#5f6368", fontWeight: "400" },
  cardAvailability: { fontSize: 13, fontWeight: "500" },
});
