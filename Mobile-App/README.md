# BOOKaCRIB: Mobile App (Customer App)

React Native (Expo) app for the BOOKaCRIB Guesthouse Discovery Platform. Travelers use it to browse, search, favourite, and rate guesthouses. Browsing requires no account; favouriting and rating require login.

## Tech Stack

- React Native (TypeScript) + Expo
- Firebase Auth (customer login, persistent sessions via AsyncStorage)
- Backend REST API (guesthouse data, ratings, and favourites)

## Project Structure

```
Mobile-App/
├── src/
│   ├── api/          # client.ts (REST wrapper), ratings.ts
│   ├── components/   # FavoriteButton, GuesthouseCard, RatingInput, SearchBar
│   ├── context/      # FavoritesContext.tsx, AuthContext.tsx
│   ├── hooks/        # useCurrentUser.ts
│   ├── navigation/   # RootNavigator.tsx
│   ├── screens/      # SearchScreen, GuesthouseDetailScreen, FavoritesScreen,
│   │                 # LoginScreen, ProfileScreen, MyRatingsScreen
│   └── theme/        # theme.ts (design system)
├── firebaseConfig.ts # Firebase initialization (Auth)
├── eas.json          # EAS Build profiles (preview builds an Android APK)
├── App.tsx           # Root component with providers
└── package.json
```

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment variables.** Create a `.env` file in `Mobile-App/`:

   ```
   EXPO_PUBLIC_API_BASE_URL=http://<YOUR-LAN-IP>:5000/api
   EXPO_PUBLIC_FIREBASE_API_KEY=...
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   EXPO_PUBLIC_FIREBASE_APP_ID=...
   ```

   To use the deployed backend, set `EXPO_PUBLIC_API_BASE_URL` to `https://bookacrib-guesthouse-discovery-platform.onrender.com/api`.

3. **Start the app:**

   ```bash
   npx expo start -c
   ```

   Open it in Expo Go on a phone connected to the same network.

## Building the Android APK

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

The `preview` profile in `eas.json` produces an installable `.apk` and embeds the production API URL. EAS prints a download link when the build finishes.

## Maps

The search screen can switch between list view and a Google Maps view, and the detail screen shows the guesthouse location on a map. This uses `react-native-maps`; the Google Maps API key is set in `app.json` (`androidGoogleMapsApiKey`). Restrict the key in Google Cloud Console to the Maps SDK for Android, and rotate it if the repository is ever made public.

## Notes

- The app never writes to Firestore directly; favourites and ratings go through the backend API.
- A customer account suspended by an admin is rejected by the API.
