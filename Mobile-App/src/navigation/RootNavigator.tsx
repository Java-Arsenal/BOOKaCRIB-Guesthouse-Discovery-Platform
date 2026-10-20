// src/navigation/RootNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SearchScreen from "../screens/SearchScreen";
import GuesthouseDetailScreen from "../screens/GuesthouseDetailScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MyRatingsScreen from "../screens/MyRatingsScreen";
import ComingSoonScreen from "../screens/ComingSoonScreen";

const Stack = createNativeStackNavigator();

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
          options={{ headerShown: true, title: "Profile" }}
        />
        <Stack.Screen
          name="MyRatings"
          component={MyRatingsScreen}
          options={{ headerShown: true, title: "My Ratings" }}
        />
        <Stack.Screen
          name="Favourites"
          component={ComingSoonScreen}
          options={{ headerShown: true, title: "Favourites" }}
        />
        <Stack.Screen
          name="Login"
          component={ComingSoonScreen}
          options={{ headerShown: true, title: "Log in" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}