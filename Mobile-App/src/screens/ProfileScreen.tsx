import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { updateProfile } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, shadow, spacing } from "../theme/theme";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { apiRequest } from "../api/client";

const MENU = [
  { label: "Favourites", route: "Favourites" },
  { label: "My ratings", route: "MyRatings" },
];

export default function ProfileScreen({ navigation }: any) {
  const { user, ready, logout } = useCurrentUser();
  const [loggingOut, setLoggingOut] = useState(false);
  
  // Edit name state
  const [editModal, setEditModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [savingName, setSavingName] = useState(false);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      Alert.alert("Could not sign out", "Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }, [logout]);

  const handleSaveName = async () => {
    if (!user || !newName.trim()) return;
    setSavingName(true);
    try {
      // 1. Update Firebase Auth
      await updateProfile(user, { displayName: newName.trim() });
      
      // 2. Update Backend Firestore
      const token = await user.getIdToken();
      await apiRequest('/customers/me', {
        method: 'PATCH',
        body: JSON.stringify({ full_name: newName.trim() })
      }, token);

      setEditModal(false);
      Alert.alert("Success", "Name updated!");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update name.");
    } finally {
      setSavingName(false);
    }
  };

  if (!ready) {
    return (
      <View style={[s.screen, s.center]}>
        <ActivityIndicator color={colors.coral} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[s.screen, s.center]}>
        <Text style={s.h1}>Your profile</Text>
        <Text style={s.meta}>Log in to save favourites and rate guesthouses.</Text>
        <Pressable style={s.primary} onPress={() => navigation.navigate("Login")}>
          <Text style={s.primaryText}>Log in</Text>
        </Pressable>
      </View>
    );
  }

  const name = user.displayName ?? "Guest";
  const initials = name.split(" ").map((p: string) => p[0]).join("").slice(0, 2).toUpperCase();

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl, flexGrow: 1 }}>
      <View style={s.header}>
        <View style={s.avatar}>
          <Text style={s.initials}>{initials}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={s.h1}>{name}</Text>
          <Pressable onPress={() => { setNewName(name); setEditModal(true); }}>
            <Ionicons name="pencil" size={18} color={colors.coral} />
          </Pressable>
        </View>
        <Text style={s.meta}>{user.email}</Text>
      </View>

      <View style={s.menu}>
        {MENU.map((item, i) => (
          <Pressable key={item.label} style={[s.row, i > 0 && s.rowDivider]} onPress={() => navigation.navigate(item.route)}>
            <Text style={s.rowText}>{item.label}</Text>
            <Text style={s.chevron}>›</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={[s.logout, loggingOut && { opacity: 0.6 }]} onPress={handleLogout} disabled={loggingOut}>
        {loggingOut ? <ActivityIndicator size="small" color={colors.error} /> : <Text style={s.logoutText}>Log out</Text>}
      </Pressable>

      {/* Edit Name Modal */}
      <Modal visible={editModal} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <Text style={s.modalTitle}>Edit Profile Name</Text>
            <TextInput
              style={s.modalInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="Your full name"
              placeholderTextColor={colors.slate}
            />
            <View style={s.modalActions}>
              <Pressable style={s.modalCancel} onPress={() => setEditModal(false)}>
                <Text style={s.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={s.modalSave} onPress={handleSaveName} disabled={savingName}>
                {savingName ? <ActivityIndicator size="small" color={colors.white} /> : <Text style={s.modalSaveText}>Save</Text>}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  center: { alignItems: "center", justifyContent: "center", padding: spacing.lg },
  header: { alignItems: "center", paddingVertical: spacing.lg },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.sand, alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  initials: { fontFamily: fonts.display, fontSize: 28, color: colors.ink },
  h1: { fontFamily: fonts.display, fontSize: 28, color: colors.ink },
  meta: { fontFamily: fonts.body, fontSize: 13, color: colors.slate, marginTop: spacing.xs, textAlign: "center" },
  menu: { backgroundColor: colors.white, borderRadius: radius.card, ...shadow },
  row: { minHeight: 56, paddingHorizontal: spacing.md, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  rowDivider: { borderTopWidth: 1, borderTopColor: colors.sand },
  rowText: { fontFamily: fonts.body, fontSize: 16, color: colors.ink },
  chevron: { fontSize: 22, color: colors.slate },
  logout: { height: 48, marginTop: spacing.xl, backgroundColor: colors.white, borderRadius: radius.control, alignItems: "center", justifyContent: "center" },
  logoutText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.error },
  primary: { height: 48, paddingHorizontal: spacing.xl, backgroundColor: colors.coral, borderRadius: radius.control, alignItems: "center", justifyContent: "center", marginTop: spacing.lg },
  primaryText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.white },
  
  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: spacing.lg },
  modalContent: { backgroundColor: colors.white, borderRadius: radius.card, padding: spacing.lg },
  modalTitle: { fontFamily: fonts.display, fontSize: 20, color: colors.ink, marginBottom: spacing.md },
  modalInput: { borderWidth: 1, borderColor: colors.sand, borderRadius: radius.control, padding: spacing.sm, fontFamily: fonts.body, fontSize: 16, color: colors.ink, marginBottom: spacing.lg },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: spacing.md },
  modalCancel: { padding: spacing.sm },
  modalCancelText: { fontFamily: fonts.semibold, color: colors.slate },
  modalSave: { backgroundColor: colors.coral, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radius.control, minWidth: 80, alignItems: "center" },
  modalSaveText: { fontFamily: fonts.semibold, color: colors.white },
});