// src/components/GuesthouseCard.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";

export interface Guesthouse {
  id: string;
  name: string;
  location: string;
  pricePerNight: number;
  availableRooms: number;
  rating: number;
  reviewsCount?: number;
  description: string;
  amenities: string[];
  imageUrl: string; // Synced static image asset payload pointer
}

interface GuesthouseCardProps {
  item: Guesthouse;
  onPress: () => void;
}

export default function GuesthouseCard({ item, onPress }: GuesthouseCardProps) {
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {/* Visual Image Block featuring real network image layer with a floating price badge */}
      <ImageBackground
        source={{ uri: item.imageUrl || undefined }}
        style={styles.imageBannerFrame}
        resizeMode="cover"
      >
        <View style={styles.pricePill}>
          <Text style={styles.priceText}>
            P{item.pricePerNight} <Text style={styles.perNight}>/ night</Text>
          </Text>
        </View>
      </ImageBackground>

      {/* Meta Text details block without cluttered list configurations */}
      <View style={styles.textDetailsContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.propertyTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.ratingText}>
            ⭐ {item.rating} ({item.reviewsCount ?? 0})
          </Text>
        </View>

        <Text style={styles.locationText}>📍 {item.location}, Botswana</Text>

        {/* Action Link Row Divider */}
        <View style={styles.actionDividerLine} />
        <Text style={styles.viewDetailsLink}>
          View Details & Contact Host ➔
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  imageBannerFrame: {
    height: 160,
    width: "100%",
    backgroundColor: "#f1f3f4",
    justifyContent: "flex-start",
    padding: 12,
  },
  pricePill: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  priceText: { fontSize: 15, fontWeight: "700", color: "#202124" },
  perNight: { fontSize: 11, fontWeight: "400", color: "#5f6368" },
  textDetailsContainer: { padding: 16 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#202124",
    flex: 1,
    marginRight: 8,
  },
  ratingText: { fontSize: 13, fontWeight: "600", color: "#3c4043" },
  locationText: { fontSize: 13, color: "#5f6368", marginBottom: 4 },
  actionDividerLine: {
    height: 1,
    backgroundColor: "#f1f3f4",
    marginVertical: 12,
  },
  viewDetailsLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a73e8",
    textAlign: "center",
  },
});
