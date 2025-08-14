import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import CustomTabBar from "@/components/CustomTabBar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === "ios" ? 90 : 70,
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
        },
        tabBarActiveTintColor: "#9747FF",
        tabBarInactiveTintColor: "#222222",
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarAccessibilityLabel: "Home tab",
        }}
      />
      <Tabs.Screen
        name="fitness"
        options={{
          title: "Fitness",
          tabBarAccessibilityLabel: "Fitness tab",
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarAccessibilityLabel: "Search tab",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarAccessibilityLabel: "Profile tab",
        }}
      />
    </Tabs>
  );
}
