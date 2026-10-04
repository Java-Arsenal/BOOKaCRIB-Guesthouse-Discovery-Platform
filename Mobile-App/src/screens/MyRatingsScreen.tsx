import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, fonts, radius, shadow, spacing } from '../theme/theme';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { fetchMyRatings, MyRating } from '../api/ratings';
import RatingInput from '../components/RatingInput';

export default function MyRatingsScreen() {
  const { user } = useCurrentUser();
  const [ratings, setRatings] = useState<MyRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<MyRating | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    try { setRatings(await fetchMyRatings(user)); } finally { setLoading(false); }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <View style={s.center}><ActivityIndicator color={colors.coral} /></View>;

  return (
    <View style={s.screen}>
      <FlatList
        data={ratings}
        keyExtractor={(r) => r.guesthouse_id}
        contentContainerStyle={{ padding: spacing.md }}
        ListEmptyComponent={<Text style={s.meta}>You haven't rated any guesthouses yet. Open a guesthouse and tap Rate.</Text>}
        renderItem={({ item }) => (
          <Pressable style={s.card} onPress={() => setEditing(item)}>
            <View style={{ flex: 1 }}>
              <Text style={s.name}>{item.guesthouse_name}</Text>
              {!!item.city && <Text style={s.meta}>{item.city}</Text>}
              {!!item.comment && <Text style={s.comment} numberOfLines={2}>{item.comment}</Text>}
            </View>
            <Text style={s.rating}>★ {item.rating.toFixed(1)}</Text>
          </Pressable>
        )}
      />
      {editing && (
        <RatingInput
          visible
          guesthouseId={editing.guesthouse_id}
          guesthouseName={editing.guesthouse_name}
          initialRating={editing.rating}
          initialComment={editing.comment ?? ''}
          onClose={() => setEditing(null)}
          onSubmitted={load}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: radius.card, padding: spacing.md, marginBottom: spacing.md, ...shadow },
  name: { fontFamily: fonts.display, fontSize: 18, color: colors.ink },
  meta: { fontFamily: fonts.body, fontSize: 13, color: colors.slate, marginTop: 2 },
  comment: { fontFamily: fonts.body, fontSize: 14, color: colors.ink, marginTop: spacing.sm },
  rating: { fontFamily: fonts.bold, fontSize: 16, color: colors.gold, marginLeft: spacing.md },
});