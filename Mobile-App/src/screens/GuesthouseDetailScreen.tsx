import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import RatingInput from "../components/RatingInput";
import { colors, fonts, radius, spacing, shadow } from "../theme/theme";

export default function GuesthouseDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();

  const guesthouse = route.params?.guesthouse;
  const [rateOpen, setRateOpen] = useState(false);

  const openMaps = () => {
    const query = encodeURIComponent(
      `${guesthouse.name}, ${guesthouse.location}, Botswana`,
    );
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  const callHost = () => {
    if (guesthouse.hostPhone) Linking.openURL(`tel:${guesthouse.hostPhone}`);
  };

  if (!guesthouse) {
    return (
      <View style={styles.centerFallbackContainer}>
        <Text style={styles.fallbackText}>No guesthouse data found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.circleBtn}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={20} color={colors.ink} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: spacing.lg }}>
        <View style={styles.imageBlock} />

        {/* Main card */}
        <View style={styles.card}>
          {guesthouse.isSuperhost && (
            <View style={styles.superhostBadge}>
              <Ionicons name="shield-checkmark" size={12} color={colors.teal} />
              <Text style={styles.superhostText}>SUPERHOST MANAGED</Text>
            </View>
          )}
          <Text style={styles.title}>{guesthouse.name}</Text>
          <View style={styles.row}>
            <Ionicons name="location-outline" size={15} color={colors.slate} />
            <Text style={styles.locationText}>
              {guesthouse.location}, Botswana
            </Text>
          </View>

          <View
            style={[styles.row, { marginTop: spacing.md, gap: spacing.sm }]}
          >
            <View style={styles.pill}>
              <Ionicons name="star" size={14} color={colors.gold} />
              <Text style={styles.pillText}>
                {guesthouse.rating} ({guesthouse.reviewsCount || 12} reviews)
              </Text>
            </View>
            <TouchableOpacity
              style={styles.pill}
              onPress={() => setRateOpen(true)}
            >
              <Ionicons
                name="chatbox-ellipses-outline"
                size={14}
                color={colors.coral}
              />
              <Text style={[styles.pillText, { color: colors.coral }]}>
                + Rate this Guesthouse
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.priceBox}>
            <View style={styles.priceTop}>
              <Text style={styles.price}>
                P{guesthouse.pricePerNight}{" "}
                <Text style={styles.perNight}>/ night</Text>
              </Text>
              <View style={styles.zeroFee}>
                <Text style={styles.zeroFeeText}>Zero Booking Fee</Text>
              </View>
            </View>
            <Text style={styles.priceNote}>
              Pay host directly upon arrival. No middleman or platform markups.
            </Text>
          </View>
        </View>

        {/* Host card */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons
              name="person-circle-outline"
              size={36}
              color={colors.slate}
            />
            <View style={{ marginLeft: spacing.sm }}>
              <Text style={styles.hostName}>
                {guesthouse.hostName || "Your host"}
              </Text>
              <Text style={styles.hostRole}>Host</Text>
            </View>
          </View>
          {guesthouse.hostPhone ? (
            <TouchableOpacity style={styles.callBtn} onPress={callHost}>
              <Ionicons name="call-outline" size={16} color={colors.coral} />
              <Text style={styles.callText}>
                Call Host ({guesthouse.hostPhone})
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.priceNote}>
              Host contact details coming soon.
            </Text>
          )}
        </View>

        {/* About */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About the Guesthouse</Text>
          <Text style={styles.body}>{guesthouse.description}</Text>
        </View>

        {/* Amenities */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Key Amenities</Text>
          <View style={styles.amenityWrap}>
            {guesthouse.amenities.map((amenity: string, index: number) => (
              <View key={index} style={styles.amenityChip}>
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Location */}
        <View style={styles.card}>
          <View style={styles.locationHeader}>
            <Text style={styles.sectionTitle}>Location</Text>
            <TouchableOpacity style={styles.pill} onPress={openMaps}>
              <Ionicons name="compass-outline" size={14} color={colors.ink} />
              <Text style={styles.pillText}>Google Maps</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.body}>{guesthouse.location}, Botswana</Text>
        </View>
      </ScrollView>

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
  safe: { flex: 1, backgroundColor: colors.cream },
  centerFallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.cream,
  },
  fallbackText: { color: colors.slate, fontSize: 15, fontFamily: fonts.body },

  topBar: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.sand,
    alignItems: "center",
    justifyContent: "center",
  },
  imageBlock: {
    height: 200,
    backgroundColor: colors.sand,
    marginHorizontal: spacing.md,
    borderRadius: radius.card,
  },

  card: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.sand,
    ...shadow,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  superhostBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: colors.sand,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: spacing.sm,
  },
  superhostText: { fontSize: 10, fontFamily: fonts.bold, color: colors.teal },
  title: {
    fontSize: 24,
    fontFamily: fonts.display,
    color: colors.ink,
    marginBottom: 4,
  },
  locationText: { fontSize: 14, fontFamily: fonts.body, color: colors.slate },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.sand,
    backgroundColor: colors.white,
  },
  pillText: { fontSize: 13, fontFamily: fonts.semibold, color: colors.ink },

  priceBox: {
    marginTop: spacing.md,
    padding: 12,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.sand,
    backgroundColor: colors.cream,
  },
  priceTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: { fontSize: 22, fontFamily: fonts.display, color: colors.ink },
  perNight: { fontSize: 12, fontFamily: fonts.body, color: colors.slate },
  zeroFee: {
    borderWidth: 1,
    borderColor: colors.teal,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  zeroFeeText: { fontSize: 11, fontFamily: fonts.semibold, color: colors.teal },
  priceNote: {
    fontSize: 12,
    fontFamily: fonts.body,
    color: colors.slate,
    marginTop: 8,
  },

  hostName: { fontSize: 15, fontFamily: fonts.semibold, color: colors.ink },
  hostRole: { fontSize: 12, fontFamily: fonts.body, color: colors.slate },
  callBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: spacing.md,
  },
  callText: { fontSize: 14, fontFamily: fonts.semibold, color: colors.coral },

  sectionTitle: {
    fontSize: 17,
    fontFamily: fonts.display,
    color: colors.ink,
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.slate,
    lineHeight: 22,
  },
  amenityWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  amenityChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.sand,
  },
  amenityText: { fontSize: 13, fontFamily: fonts.body, color: colors.ink },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
