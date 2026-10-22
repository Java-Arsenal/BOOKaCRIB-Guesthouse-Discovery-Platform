import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fonts, spacing } from "../theme/theme";

export default function ComingSoonScreen({ route }: any) {
  const title = route?.name ?? "This feature";
  return (
    <View style={s.center}>
      <Text style={s.text}>{title} is coming soon.</Text>
    </View>
  );
}

const s = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cream,
    padding: spacing.lg,
  },
  text: { fontFamily: fonts.body, fontSize: 16, color: colors.slate, textAlign: "center" },
});