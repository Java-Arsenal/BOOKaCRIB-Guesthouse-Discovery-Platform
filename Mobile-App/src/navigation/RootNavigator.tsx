// src/navigation/RootNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Core Application Screen Module Imports (Pointed to your official structural file)
import SearchScreen from "../screens/SearchScreen";
import GuesthouseDetailScreen from "../screens/GuesthouseDetailScreen";

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}