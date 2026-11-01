import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import RatingInput from "../components/RatingInput";
import FavoriteButton from "../components/FavoriteButton";
import { apiRequest } from "../api/client"; // <-- Added this import
import { colors, fonts, radius, spacing, shadow } from "../theme/theme";

export default function GuesthouseDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<NativeStackNavigationProp<{ Login: undefined }>>();

  const guesthouse = route.params?.guesthouse;
  const [rateOpen, setRateOpen] = useState(false);
  
  // NEW: State for reviews
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // NEW: Fetch reviews when the screen loads
  useEffect(() => {
    if (!guesthouse?.id) return;
    
    const fetchReviews = async () => {
      try {
        const data = await apiRequest(`/ratings/guesthouse/${guesthouse.id}`);
        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Failed to load reviews:", error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [guesthouse?.id]);

  const openMaps = () => {
    const query = encodeURIComponent(
      typeof guesthouse.latitude === "number" &&
        Number.isFinite(guesthouse.latitude) &&
        typeof guesthouse.longitude === "number" &&
        Number.isFinite(guesthouse.longitude)
        ? `${guesthouse.latitude},${guesthouse.longitude}`
        : `${guesthouse.name}, ${guesthouse.location}, Botswana`,
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
        <View style={{ flex: 1 }} />
        <FavoriteButton
          guesthouseId={guesthouse.id}
          onRequireLogin={() => navigation.navigate("Login")}
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: spacing.lg }}>
        {guesthouse.logoUrl ? (
          <Image source={{ uri: guesthouse.logoUrl }} style={styles.imageBlock} />
        ) : (
          <View style={styles.imageBlock} />
        )}

        {guesthouse.galleryUrls && guesthouse.galleryUrls.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.galleryStrip}
            contentContainerStyle={{ paddingHorizontal: spacing.md, gap: spacing.sm }}
          >
            {guesthouse.galleryUrls.map((url: string, index: number) => (
              <Image key={index} source={{ uri: url }} style={styles.galleryThumb} />
            ))}
          </ScrollView>
        )}

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

          <View style={[styles.row, { marginTop: spacing.md, gap: spacing.sm }]}>
            <View style={styles.pill}>
              <Ionicons name="star" size={14} color={colors.gold} />
              <Text style={styles.pillText}>
                {guesthouse.rating} ({guesthouse.reviewsCount ?? 0} reviews)
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

        {/* NEW: Guest Reviews */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Guest Reviews</Text>
          
          {reviewsLoading ? (
            <ActivityIndicator size="small" color={colors.coral} style={{ marginTop: 10, alignSelf: "flex-start" }} />
          ) : reviews.length === 0 ? (
            <Text style={styles.body}>No reviews yet. Be the first to rate this stay!</Text>
          ) : (
            reviews.map((rev, index) => (
              <View 
                key={rev.rating_id || index} 
                style={[
                  styles.reviewItem, 
                  index !== reviews.length - 1 && styles.reviewDivider
                ]}
              >
                <View style={styles.reviewHeader}>
                  <View style={styles.row}>
                    <Ionicons name="star" size={14} color={colors.gold} />
                    <Text style={styles.reviewScore}>{rev.score}.0</Text>
                  </View>
                  <Text style={styles.reviewAuthor}>Verified Guest</Text>
                </View>
                <Text style={styles.reviewComment}>
                  "{rev.comment || "Great stay!"}"
                </Text>
              </View>
            ))
          )}
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

        {/* Location with Map */}
        <View style={styles.card}>
          <View style={styles.locationHeader}>
            <Text style={styles.sectionTitle}>Location</Text>
            <TouchableOpacity style={styles.pill} onPress={openMaps}>
              <Ionicons name="compass-outline" size={14} color={colors.ink} />
              <Text style={styles.pillText}>Google Maps</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.body}>{guesthouse.location}, Botswana</Text>
          
          {guesthouse.latitude && guesthouse.longitude ? (
            <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={openMaps}
              style={styles.mapWrapper}
            >
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                  latitude: guesthouse.latitude,
                  longitude: guesthouse.longitude,
                  latitudeDelta: 0.02,
                  longitudeDelta: 0.02,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: guesthouse.latitude,
                    longitude: guesthouse.longitude,
                  }}
                  title={guesthouse.name}
                />
              </MapView>
            </TouchableOpacity>
          ) : (
            <View style={styles.mapFallback}>
              <Ionicons name="map-outline" size={24} color={colors.slate} />
              <Text style={styles.fallbackText}>Exact coordinates not available.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <RatingInput
        visible={rateOpen}
        guesthouseId={guesthouse.id}
        guesthouseName={guesthouse.name}
        onClose={() => {
          setRateOpen(false);
          // Optional: refresh the reviews list when the modal closes
          const fetchReviews = async () => {
            const data = await apiRequest(`/ratings/guesthouse/${guesthouse.id}`);
            setReviews(Array.isArray(data) ? data : []);
          };
          fetchReviews();
        }}
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
  fallbackText: {
    color: colors.slate,
    fontSize: 13,
    fontFamily: fonts.body,
    marginTop: 8,
  },
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
  galleryStrip: {
    marginTop: spacing.sm,
  },
  galleryThumb: {
    width: 100,
    height: 80,
    borderRadius: radius.control,
    backgroundColor: colors.sand,
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
  
  // NEW: Review Styles
  reviewItem: {
    paddingVertical: spacing.sm,
  },
  reviewDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.sand,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  reviewScore: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.ink,
    marginLeft: 4,
  },
  reviewAuthor: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.slate,
  },
  reviewComment: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.slate,
    fontStyle: "italic",
    lineHeight: 20,
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
  mapWrapper: {
    marginTop: spacing.md,
    width: "100%",
    height: 180,
    borderRadius: radius.control,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.sand,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapFallback: {
    marginTop: spacing.md,
    width: "100%",
    height: 100,
    borderRadius: radius.control,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.sand,
    alignItems: "center",
    justifyContent: "center",
  },
});