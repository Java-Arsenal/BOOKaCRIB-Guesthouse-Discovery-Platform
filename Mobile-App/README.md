# BOOKaCRIB  Mobile App

React Native (Expo) app for the BOOKaCRIB Guesthouse Discovery Platform. Used by travelers to browse, search, favourite, and rate guesthouses. Browsing/search requires no account; favouriting and rating require login.

**Team:** Wangu Zwiyo, Debbie Bame, Kutlwano Joao

## Tech Stack

- React Native (TypeScript) + Expo
- Firebase Auth (customer login)
- Firebase Firestore client SDK (real-time listeners, read-only, with offline persistence)

## Project Structure

```
mobile-app/
├── src/
│   ├── api/
│   │   └── client.ts
│   ├── screens/
│   │   ├── SearchScreen.tsx
│   │   ├── GuesthouseDetailScreen.tsx
│   │   ├── FavouritesScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── components/
│   │   ├── GuesthouseCard.tsx
│   │   ├── RatingInput.tsx
│   │   └── SearchBar.tsx
│   ├── hooks/
│   │   └── useFirestoreListener.ts
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   └── context/
│       └── AuthContext.tsx
├── App.tsx
├── app.json
└── package.json
```

## Setup

```bash
git clone git@github.com:Java-Arsenal/BOOKaCRIB-Guesthouse-Discovery-Platform-.git
cd BOOKaCRIB-Guesthouse-Discovery-Platform-
git checkout Mobile-App

npm install
```

Create a `.env` file in `mobile-app/` 
```
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_API_BASE_URL=http://localhost:5000
```

```bash
npx expo start
```

Scan the QR code with Expo Go (or run on a simulator) to launch the app.

## Task Split 

1. **Search & browse**: `SearchScreen`, `GuesthouseDetailScreen`, `SearchBar`, default sort (cheapest first), works for guests with no login.
2. **Auth & favourites**: `LoginScreen`, `FavouritesScreen`, `AuthContext`, favourite/unfavourite via backend API.
3. **Ratings & profile**: `RatingInput` (submit/edit 1–5 rating + comment), `ProfileScreen`.

## Notes

- Firestore offline persistence is built into the client SDK  previously loaded listings stay viewable offline and re-sync automatically, no extra setup needed.
- Rating submission and edits both go through the same backend endpoint (`rating_id = {customer_id}_{guesthouse_id}` means a second submission overwrites the first).
- All writes go through the backend API never write to Firestore directly.