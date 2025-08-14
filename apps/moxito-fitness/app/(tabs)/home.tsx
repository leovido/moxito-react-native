import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "@moxito/theme";

export default function HomeScreen() {
  const [workoutStarted, setWorkoutStarted] = useState(false);

  const handleStartWorkout = () => {
    setWorkoutStarted(true);
    console.log("Start Workout");
    // TODO: Navigate to workout screen or start workout timer
  };

  const handleViewStats = () => {
    console.log("View Stats");
    // TODO: Navigate to stats screen
  };

  const handleViewHistory = () => {
    console.log("View History");
    // TODO: Navigate to workout history screen
  };

  return (
    <ImageBackground
      source={require("../../assets/images/app-bg2.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Workout Dashboard</Text>
            <Text style={styles.subtitle}>
              Ready to crush your fitness goals?
            </Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Pressable
              style={styles.primaryButton}
              onPress={handleStartWorkout}
            >
              <LinearGradient
                colors={["#9747FF", "#7C3AED"]}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.primaryButtonText}>
                  {workoutStarted ? "Continue Workout" : "Start Workout"}
                </Text>
              </LinearGradient>
            </Pressable>

            <View style={styles.secondaryActions}>
              <Pressable
                style={styles.secondaryButton}
                onPress={handleViewStats}
              >
                <Text style={styles.secondaryButtonText}>View Stats</Text>
              </Pressable>

              <Pressable
                style={styles.secondaryButton}
                onPress={handleViewHistory}
              >
                <Text style={styles.secondaryButtonText}>Workout History</Text>
              </Pressable>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.recentActivity}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityCard}>
              <Text style={styles.activityText}>No recent workouts</Text>
              <Text style={styles.activitySubtext}>
                Start your first workout to see your progress!
              </Text>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <Text style={styles.sectionTitle}>Quick Stats</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Workouts</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Minutes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: "Lato_700Bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#E5E7EB",
    textAlign: "center",
    fontFamily: "Lato_400Regular",
  },
  quickActions: {
    marginBottom: 30,
  },
  primaryButton: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#9747FF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradientButton: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Lato_700Bold",
  },
  secondaryActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Lato_700Bold",
  },
  recentActivity: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
    fontFamily: "Lato_700Bold",
  },
  activityCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
  },
  activityText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 8,
    fontFamily: "Lato_700Bold",
  },
  activitySubtext: {
    fontSize: 14,
    color: "#D1D5DB",
    textAlign: "center",
    fontFamily: "Lato_400Regular",
  },
  quickStats: {
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#9747FF",
    marginBottom: 4,
    fontFamily: "Lato_700Bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#D1D5DB",
    textAlign: "center",
    fontFamily: "Lato_400Regular",
  },
});
