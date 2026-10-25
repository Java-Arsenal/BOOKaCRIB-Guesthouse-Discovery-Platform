// src/navigation/RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SearchScreen from '../screens/SearchScreen';
import GuesthouseDetailScreen from '../screens/GuesthouseDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MyRatingsScreen from '../screens/MyRatingsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import LoginScreen from '../screens/LoginScreen';

export type RootStackParamList = {
  Search: undefined;
  // Two callers pass `{ guesthouse: X }` with different X shapes:
  //   - SearchScreen: raw API item (guesthouse_id, price_per_night_bwp, ...)
  //   - FavoritesScreen: normalized (id, pricePerNight, ...)
  // GuesthouseDetailScreen already handles whichever it receives; type as
  // `any` to avoid pretending they're uniform. Refactor both callers to a
  // shared normalizer later if it becomes a maintenance issue.
  GuesthouseDetailScreen: { guesthouse: any };
  Profile: undefined;
  MyRatings: undefined;
  Favourites: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Search"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen
          name="GuesthouseDetailScreen"
          component={GuesthouseDetailScreen}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: true, title: 'Profile' }}
        />
        <Stack.Screen
          name="MyRatings"
          component={MyRatingsScreen}
          options={{ headerShown: true, title: 'My Ratings' }}
        />
        <Stack.Screen
          name="Favourites"
          component={FavoritesScreen}
          options={{ headerShown: true, title: 'Favourites' }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: true,
            title: 'Log in',
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}