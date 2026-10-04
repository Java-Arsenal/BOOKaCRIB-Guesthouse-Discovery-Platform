
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useFonts, Fraunces_600SemiBold } from '@expo-google-fonts/fraunces';
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import ProfileScreen from '../screens/ProfileScreen';
import MyRatingsScreen from '../screens/MyRatingsScreen';
import RatingInput from '../components/RatingInput';
import { colors, fonts, spacing, radius } from '../theme/theme';

export default function PreviewApp() {
  const [loaded] = useFonts({ Fraunces_600SemiBold, Inter_400Regular, Inter_600SemiBold, Inter_700Bold });
  const [tab, setTab] = useState<'Profile' | 'MyRatings'>('Profile');
  const [modal, setModal] = useState(false);

  if (!loaded) return <View style={s.center}><ActivityIndicator color={colors.coral} /></View>;

  const fakeNav = { navigate: (route: string) => (route === 'MyRatings' ? setTab('MyRatings') : console.log('navigate ->', route)) };

  return (
    <View style={s.root}>
      <View style={s.bar}>
        {(['Profile', 'MyRatings'] as const).map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={[s.chip, tab === t && s.chipOn]}>
            <Text style={[s.chipText, tab === t && { color: colors.white }]}>{t === 'Profile' ? 'Profile' : 'My ratings'}</Text>
          </Pressable>
        ))}
        <Pressable onPress={() => setModal(true)} style={s.chip}><Text style={s.chipText}>Rating modal</Text></Pressable>
      </View>

      {tab === 'Profile' ? <ProfileScreen navigation={fakeNav} /> : <MyRatingsScreen />}

      <RatingInput visible={modal} guesthouseId="g-new" guesthouseName="Phakalane Palms" onClose={() => setModal(false)} />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream, paddingTop: 44 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream },
  bar: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  chip: { minHeight: 44, paddingHorizontal: spacing.md, justifyContent: 'center', borderRadius: radius.pill, borderWidth: 1, borderColor: colors.sand, backgroundColor: colors.white },
  chipOn: { backgroundColor: colors.coral, borderColor: colors.coral },
  chipText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.slate },
});