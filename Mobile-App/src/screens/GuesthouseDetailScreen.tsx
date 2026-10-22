// src/screens/GuesthouseDetailScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import RatingInput from "../components/RatingInput";

export default function GuesthouseDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();

  const guesthouse = route.params?.guesthouse;
  const [rateOpen, setRateOpen] = useState(false);

  const handleBookingAction = () => {
    Alert.alert(
      "Booking Initiated",
      `Would you like to send a reservation request to ${guesthouse?.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: () => alert("Reservation Request Sent!") },
      ],
    );
  };

  if (!guesthouse) {
    return (
      <View style={styles.centerFallbackContainer}>
        <Text style={styles.fallbackText}>No guesthouse data found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.headerNavBar}>
        <TouchableOpacity
          style={styles.backButtonAction}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>⬅ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitleLabel} numberOfLines={1}>
          {guesthouse.name}
        </Text>
      </View>

      <ScrollView style={styles.detailsMainContainer}>
        <View style={styles.imageBlockMock} />

        <View style={styles.detailsContentBody}>
          <Text style={styles.titleText}>{guesthouse.name}</Text>
          <Text style={styles.locationSubText}>
            📍 {guesthouse.location}, Botswana
          </Text>

          <View style={styles.ratingPriceRow}>
            <Text style={styles.ratingLabel}>
              ⭐ {guesthouse.rating} ({guesthouse.reviewsCount || 12} reviews)
            </Text>
            <Text style={styles.roomsLabel}>
              🛏️ {guesthouse.availableRooms} rooms left
            </Text>
          </View>

          <View style={styles.dividerLine} />

          <Text style={styles.sectionHeaderTitle}>Description</Text>
          <Text style={styles.bodyDescriptionText}>
            {guesthouse.description}
          </Text>

          {/* 👑 GROUNDED PLACEMENT: Amenities now render exclusively here in the detail overview panel */}
          <Text style={styles.sectionHeaderTitle}>Amenities Included</Text>
          <View style={styles.amenitiesWrapperRow}>
            {guesthouse.amenities.map((amenity: string, index: number) => (
              <View key={index} style={styles.amenityChipItem}>
                <Text style={styles.amenityChipText}>{amenity}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.rateButton}
            onPress={() => setRateOpen(true)}
          >
            <Text style={styles.rateButtonText}>Rate this stay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.stickyBookingStickyFooter}>
        <View style={styles.footerPriceBlock}>
          <Text style={styles.footerPriceLabel}>
            P{guesthouse.pricePerNight}
          </Text>
          <Text style={styles.footerSubText}>total / night</Text>
        </View>
        <TouchableOpacity
          style={styles.ctaPrimaryButton}
          onPress={handleBookingAction}
        >
          <Text style={styles.ctaButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>

      <RatingInput
        visible={rateOpen}
        guesthouseId={guesthouse.id}
        guesthouseName={guesthouse.name}
        onClose={() => setRateOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#ffffff" },
  headerNavBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#f1f3f4",
    backgroundColor: "#ffffff",
  },
  backButtonAction: { paddingRight: 16, paddingVertical: 8 },
  backButtonText: { fontSize: 15, color: "#1a73e8", fontWeight: "600" },
  headerTitleLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#202124",
    flex: 1,
  },
  detailsMainContainer: { flex: 1 },
  centerFallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: { color: "#5f6368", fontSize: 15 },
  imageBlockMock: { height: 220, backgroundColor: "#f1f3f4" },
  detailsContentBody: { padding: 20 },
  titleText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#202124",
    marginBottom: 6,
  },
  locationSubText: { fontSize: 15, color: "#5f6368", marginBottom: 16 },
  ratingPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingLabel: { fontSize: 14, fontWeight: "600", color: "#202124" },
  roomsLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#d93025",
    backgroundColor: "#fce8e6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  dividerLine: { height: 1, backgroundColor: "#f1f3f4", marginVertical: 16 },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#202124",
    marginBottom: 8,
    marginTop: 8,
  },
  bodyDescriptionText: {
    fontSize: 15,
    color: "#3c4043",
    lineHeight: 22,
    marginBottom: 16,
  },
  amenitiesWrapperRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
  amenityChipItem: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  amenityChipText: { fontSize: 13, color: "#3c4043", fontWeight: "500" },
  rateButton: {
    marginTop: 8,
    height: 48,
    backgroundColor: "#1a73e8",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  rateButtonText: { color: "#ffffff", fontWeight: "700", fontSize: 15 },
  stickyBookingStickyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: "#f1f3f4",
    backgroundColor: "#ffffff",
  },
  footerPriceBlock: { flexDirection: "column" },
  footerPriceLabel: { fontSize: 22, fontWeight: "800", color: "#202124" },
  footerSubText: { fontSize: 12, color: "#5f6368", marginTop: 2 },
  ctaPrimaryButton: {
    backgroundColor: "#1a73e8",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  ctaButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
});