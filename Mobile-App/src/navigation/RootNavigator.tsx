// src/navigation/RootNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Active Screen Imports
import SearchScreen from "../screens/SearchScreen";
import GuesthouseDetailScreen from "../screens/GuesthouseDetailScreen";

// Empty screens commented out until team members push their code:
// import FavoritesScreen from "../screens/FavoritesScreen";
// import LoginScreen from "../screens/LoginScreen";
// import MyRatingsScreen from "../screens/MyRatingsScreen";
// import ProfileScreen from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Search"
        screenOptions={{ headerShown: false }}
      >
        {/* Active Working Screens */}
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen
          name="GuesthouseDetailScreen"
          component={GuesthouseDetailScreen}
        />

        {/* Commented out stack routes for other members:
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MyRatings" component={MyRatingsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} /> 
        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
