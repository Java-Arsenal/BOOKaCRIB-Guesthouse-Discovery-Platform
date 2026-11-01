import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail, // <-- Added
  type User,
} from 'firebase/auth';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { auth } from '../../firebaseConfig';
import { apiRequest } from '../api/client';
import { useFavorites } from '../context/FavoritesContext';
import { colors, fonts, radius, shadow, spacing } from '../theme/theme';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;
type Mode = 'login' | 'signup';

/**
 * Ensures a `customers/<uid>` doc exists for the given Firebase user.
 */
async function ensureCustomerProfile(user: User, fallbackName?: string): Promise<void> {
  try {
    const token = await user.getIdToken();
    const name =
      user.displayName?.trim() ||
      fallbackName?.trim() ||
      user.email?.split('@')[0] ||
      'Customer';
    await apiRequest(
      '/customers',
      { method: 'POST', body: JSON.stringify({ full_name: name }) },
      token,
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (!msg.toLowerCase().includes('already exists')) {
      console.warn('[login] ensureCustomerProfile failed:', msg);
    }
  }
}

export default function LoginScreen({ navigation }: Props) {
  const { refresh } = useFavorites();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isSignup = mode === 'signup';

  async function handleSubmit() {
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter email and password.');
      return;
    }
    if (isSignup && !fullName.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (isSignup && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      let user: User;

      if (isSignup) {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password,
        );
        await updateProfile(cred.user, { displayName: fullName.trim() });
        user = cred.user;
      } else {
        const cred = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password,
        );
        user = cred.user;
      }

      await ensureCustomerProfile(user, isSignup ? fullName.trim() : undefined);

      try {
        await refresh();
      } catch {
        // best-effort
      }

      navigation.goBack();
    } catch (e: any) {
      setError(humanizeAuthError(e?.code, e?.message));
    } finally {
      setSubmitting(false);
    }
  }

  // NEW: Forgot Password Handler
  async function handleForgotPassword() {
    if (!email.trim()) {
      setError('Please enter your email address first, then click "Forgot Password".');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert(
        "Email Sent",
        "Check your inbox for a link to reset your password."
      );
    } catch (e: any) {
      setError(humanizeAuthError(e?.code, e?.message));
    } finally {
      setSubmitting(false);
    }
  }

  function toggleMode() {
    setMode(isSignup ? 'login' : 'signup');
    setError(null);
  }

  return (
    <KeyboardAvoidingView
      style={s.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.header}>
          <View style={s.iconBadge}>
            <Ionicons name="person-outline" size={26} color={colors.coral} />
          </View>
          <Text style={s.h1}>
            {isSignup ? 'Create your account' : 'Welcome back'}
          </Text>
          <Text style={s.meta}>
            {isSignup
              ? 'Save favourites and rate your stays.'
              : 'Log in to save favourites and rate guesthouses.'}
          </Text>
        </View>

        <View style={s.card}>
          {isSignup && (
            <View style={s.field}>
              <Text style={s.label}>Full name</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="e.g. Onalenna K."
                placeholderTextColor={colors.slate}
                autoCapitalize="words"
                autoComplete="name"
                style={s.input}
                editable={!submitting}
              />
            </View>
          )}

          <View style={s.field}>
            <Text style={s.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.slate}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              style={s.input}
              editable={!submitting}
            />
          </View>

          <View style={s.field}>
            <Text style={s.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="At least 6 characters"
              placeholderTextColor={colors.slate}
              secureTextEntry
              autoCapitalize="none"
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              textContentType={isSignup ? 'newPassword' : 'password'}
              style={s.input}
              editable={!submitting}
            />
            
            {/* NEW: Forgot Password Link */}
            {!isSignup && (
              <Pressable
                onPress={handleForgotPassword}
                disabled={submitting}
                style={s.forgotButton}
              >
                <Text style={s.forgotText}>Forgot Password?</Text>
              </Pressable>
            )}
          </View>

          {error && (
            <View style={s.errorBanner}>
              <Ionicons
                name="alert-circle-outline"
                size={16}
                color={colors.error}
              />
              <Text style={s.errorText}>{error}</Text>
            </View>
          )}

          <Pressable
            style={({ pressed }) => [
              s.primaryButton,
              pressed && s.primaryButtonPressed,
              submitting && s.primaryButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={s.primaryButtonText}>
                {isSignup ? 'Create account' : 'Log in'}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={toggleMode}
            disabled={submitting}
            style={s.toggleButton}
          >
            <Text style={s.toggleText}>
              {isSignup
                ? 'Already have an account? '
                : "Don't have an account? "}
              <Text style={s.toggleTextAction}>
                {isSignup ? 'Log in' : 'Create one'}
              </Text>
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => navigation.goBack()}
          disabled={submitting}
          style={s.guestButton}
        >
          <Text style={s.guestText}>Continue as guest</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function humanizeAuthError(code?: string, fallback?: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'That email address is not valid.';
    case 'auth/user-not-found':
      return 'No account with that email. Try signing up.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'An account with that email already exists. Try logging in instead.';
    case 'auth/weak-password':
      return 'Password is too weak. Use at least 6 characters.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again in a minute.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled for this project.';
    default:
      return fallback || 'Something went wrong. Please try again.';
  }
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.sand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  h1: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.ink,
    textAlign: 'center',
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.slate,
    marginTop: spacing.xs,
    textAlign: 'center',
    lineHeight: 18,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: spacing.md,
    ...shadow,
  },
  field: { marginBottom: spacing.md },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.sand,
    borderRadius: radius.control,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.white,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
    paddingVertical: spacing.xs,
  },
  forgotText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.coral,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
    paddingLeft: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
  },
  errorText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.error,
    lineHeight: 18,
  },
  primaryButton: {
    height: 48,
    backgroundColor: colors.coral,
    borderRadius: radius.control,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  primaryButtonPressed: { backgroundColor: colors.coralDark },
  primaryButtonDisabled: { opacity: 0.6 },
  primaryButtonText: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.white,
  },
  toggleButton: {
    marginTop: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  toggleText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.slate,
  },
  toggleTextAction: {
    fontFamily: fonts.semibold,
    color: colors.coral,
  },
  guestButton: {
    marginTop: spacing.lg,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  guestText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.slate,
    textDecorationLine: 'underline',
  },
});