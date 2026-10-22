import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { colors, fonts, radius, spacing } from '../theme/theme';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { submitRating } from '../api/ratings';

const MAX_COMMENT = 500;

type Props = {
  visible: boolean;
  guesthouseId: string;
  guesthouseName: string;
  initialRating?: number;   // pass existing values to edit a rating
  initialComment?: string;
  onClose: () => void;
  onSubmitted?: () => void;
};

export default function RatingInput({
  visible, guesthouseId, guesthouseName, initialRating = 0, initialComment = '', onClose, onSubmitted,
}: Props) {
  const { user } = useCurrentUser();
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // reset whenever the sheet is reopened (new guesthouse or edit)
  useEffect(() => {
    if (visible) { setRating(initialRating); setComment(initialComment); setError(''); }
  }, [visible, initialRating, initialComment]);

  const submit = async () => {
    if (!user) return setError('Log in to rate this guesthouse.');
    if (rating < 1) return setError('Tap a star from 1 to 5 to rate this stay.');
    try {
      setSaving(true); setError('');
      await submitRating(user, { id: guesthouseId, name: guesthouseName }, rating, comment.trim());
      onSubmitted?.();
      onClose();
    } catch (e: any) {
      setError(`Rating not saved: ${e.message ?? 'check your connection and try again.'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.backdrop}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <View style={s.sheet}>
          <Text style={s.title}>Rate {guesthouseName}</Text>

          <View style={s.stars}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable key={n} onPress={() => setRating(n)} style={s.starTap} accessibilityLabel={`${n} star${n > 1 ? 's' : ''}`}>
                <Text style={[s.star, { color: n <= rating ? colors.gold : colors.sand }]}>★</Text>
              </Pressable>
            ))}
          </View>

          <TextInput
            style={s.input}
            placeholder="Add a comment (optional)"
            placeholderTextColor={colors.slate}
            multiline
            maxLength={MAX_COMMENT}
            value={comment}
            onChangeText={setComment}
          />
          <Text style={s.counter}>{comment.length} / {MAX_COMMENT}</Text>

          {!!error && <Text style={s.error}>{error}</Text>}

          <Pressable style={({ pressed }) => [s.primary, pressed && { backgroundColor: colors.coralDark }, saving && { opacity: 0.6 }]} onPress={submit} disabled={saving}>
            {saving ? <ActivityIndicator color={colors.white} /> : <Text style={s.primaryText}>Submit rating</Text>}
          </Pressable>
          <Pressable style={s.cancel} onPress={onClose}><Text style={s.cancelText}>Cancel</Text></Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(31,27,24,0.45)' },
  sheet: { backgroundColor: colors.cream, padding: spacing.lg, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  title: { fontFamily: fonts.display, fontSize: 22, color: colors.ink, textAlign: 'center' },
  stars: { flexDirection: 'row', justifyContent: 'center', marginVertical: spacing.md },
  starTap: { minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center' }, // 44px+ tap target
  star: { fontSize: 38 },
  input: { minHeight: 104, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.sand, borderRadius: radius.control, padding: spacing.md, textAlignVertical: 'top', fontFamily: fonts.body, fontSize: 16, color: colors.ink },
  counter: { alignSelf: 'flex-end', fontFamily: fonts.body, fontSize: 13, color: colors.slate, marginTop: spacing.xs },
  error: { fontFamily: fonts.body, fontSize: 13, color: colors.error, marginTop: spacing.sm },
  primary: { height: 48, backgroundColor: colors.coral, borderRadius: radius.control, alignItems: 'center', justifyContent: 'center', marginTop: spacing.md },
  primaryText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.white },
  cancel: { height: 48, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.sand, borderRadius: radius.control, alignItems: 'center', justifyContent: 'center', marginTop: spacing.sm },
  cancelText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.slate },
});