import { Tabs } from "expo-router";
import React from "react";

import CustomTabBar from "@/components/CustomTabBar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
    </Tabs>
    </SafeAreaView>
  );
}