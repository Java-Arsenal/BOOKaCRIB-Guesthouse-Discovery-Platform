// src/screens/GuesthouseDetailScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RatingInput from "../components/RatingInput";

export default function GuesthouseDetailScreen({ route, navigation }: any) {
  const guesthouse = route?.params?.guesthouse || {
    id: "unknown",
    name: "Stay Details",
    location: "Unknown",
    pricePerNight: 0,
    description: "No details provided for this property listing.",
  };
  const [rateOpen, setRateOpen] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>⬅️ Back to Search</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          {guesthouse.name}
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>{guesthouse.name}</Text>
        <Text style={styles.location}>
          Location: {guesthouse.location}, Botswana
        </Text>
        <Text style={styles.description}>{guesthouse.description}</Text>

        <TouchableOpacity
          style={styles.rateButton}
          onPress={() => setRateOpen(true)}
        >
          <Text style={styles.rateButtonText}>Rate this stay</Text>
        </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: "#ffffff" },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#e9ecef",
    backgroundColor: "#ffffff",
  },
  backText: { color: "#1a73e8", fontWeight: "600", marginRight: 16 },
  navTitle: { fontSize: 16, fontWeight: "700", color: "#202124", flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#202124",
    marginBottom: 8,
  },
  location: { fontSize: 14, color: "#1a73e8", marginBottom: 16 },
  description: { fontSize: 15, color: "#5f6368", lineHeight: 22 },
  rateButton: {
    marginTop: 24,
    height: 48,
    backgroundColor: "#1a73e8",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  rateButtonText: { color: "#ffffff", fontWeight: "700", fontSize: 15 },
});