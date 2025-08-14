import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "@moxito/theme";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Check authentication status and redirect accordingly
    const checkAuthAndRedirect = async () => {
      try {
        // TODO: Implement actual auth check
        // For now, we'll simulate a loading delay and redirect to auth
        const isAuthenticated = false; // Replace with actual auth check

        setTimeout(() => {
          if (isAuthenticated) {
            // User is authenticated, redirect to main app
            router.replace("/(tabs)/home");
          } else {
            // User is not authenticated, redirect to auth
            router.replace("/(auth)");
          }
        }, 2000); // 2 second delay for loading screen
      } catch (error) {
        console.error("Auth check failed:", error);
        // On error, redirect to auth
        router.replace("/(auth)");
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#9747FF", "#FF6B6B"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Moxito</Text>
          <Text style={styles.subtitle}>Fitness & Wellness</Text>
          <ActivityIndicator
            size="large"
            color="#FFFFFF"
            style={styles.loader}
          />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 40,
  },
  loader: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.8,
  },
});
