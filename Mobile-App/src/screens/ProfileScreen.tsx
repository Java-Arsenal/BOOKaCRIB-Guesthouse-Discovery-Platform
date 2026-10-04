import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { colors, fonts, radius, shadow, spacing } from '../theme/theme';
import { useCurrentUser } from '../hooks/useCurrentUser';

const MENU = [
  { label: 'Favourites', route: 'Favourites' },
  { label: 'My ratings', route: 'MyRatings' },
];

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useCurrentUser();

  if (!user) {
    return (
      <View style={[s.screen, s.center]}>
        <Text style={s.h1}>Your profile</Text>
        <Text style={s.meta}>Log in to save favourites and rate guesthouses.</Text>
        <Pressable style={s.primary} onPress={() => navigation.navigate('Login')}>
          <Text style={s.primaryText}>Log in</Text>
        </Pressable>
      </View>
    );
  }

  const name = user.displayName ?? 'Guest';
  const initials = name.split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase();

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl, flexGrow: 1 }}>
      <View style={s.header}>
        <View style={s.avatar}><Text style={s.initials}>{initials}</Text></View>
        <Text style={s.h1}>{name}</Text>
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

    
      <Pressable style={s.logout} onPress={logout}>
        <Text style={s.logoutText}>Log out</Text>
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  center: { alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  header: { alignItems: 'center', paddingVertical: spacing.lg },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.sand, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  initials: { fontFamily: fonts.display, fontSize: 28, color: colors.ink },
  h1: { fontFamily: fonts.display, fontSize: 28, color: colors.ink },
  meta: { fontFamily: fonts.body, fontSize: 13, color: colors.slate, marginTop: spacing.xs, textAlign: 'center' },
  menu: { backgroundColor: colors.white, borderRadius: radius.card, ...shadow },
  row: { minHeight: 56, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowDivider: { borderTopWidth: 1, borderTopColor: colors.sand },
  rowText: { fontFamily: fonts.body, fontSize: 16, color: colors.ink },
  chevron: { fontSize: 22, color: colors.slate },
  logout: { height: 48, marginTop: spacing.xl, backgroundColor: colors.white, borderRadius: radius.control, alignItems: 'center', justifyContent: 'center' },
  logoutText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.error },
  primary: { height: 48, paddingHorizontal: spacing.xl, backgroundColor: colors.coral, borderRadius: radius.control, alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg },
  primaryText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.white },
});