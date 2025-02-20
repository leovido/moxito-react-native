import { Tabs } from "expo-router";
import React from "react";

import CustomTabBar from "@/components/CustomTabBar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen 
        name="home" 
        options={{
          title: "Home"
        }}
      />
      <Tabs.Screen 
        name="fitness" 
        options={{
          title: "Fitness"
        }}
      />
      <Tabs.Screen 
        name="search" 
        options={{
          title: "Search"
        }}
      />
      <Tabs.Screen 
        name="profile" 
        options={{
          title: "Profile"
        }}
      />
    </Tabs>
  );
}

