// src/screens/GuesthouseDetailScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GuesthouseDetailScreen({ route, navigation }: any) {
  // Graceful guard parameter payload extraction
  const guesthouse = route?.params?.guesthouse || {
    name: "Stay Details",
    location: "Unknown",
    pricePerNight: 0,
    description: "No details provided for this property listing.",
  };

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
      </ScrollView>
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
});
