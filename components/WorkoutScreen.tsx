import type { WorkoutUpdate } from '@moxito/api';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { secureRandom } from '../app/utils/crypto-utils';
import {
  Accessibility,
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from '../constants/DesignSystem';

export const WorkoutScreen = () => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutData, setWorkoutData] = useState<WorkoutUpdate | null>(null);
  const [stepCount, setStepCount] = useState(0);
  const [distance, setDistance] = useState(0);
  const [workoutInterval, setWorkoutInterval] = useState<NodeJS.Timeout | null>(null);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));
  // Use refs to track current values for use in interval callback
  const stepCountRef = useRef(0);
  const distanceRef = useRef(0);

  const startWorkout = () => {
    setIsWorkoutActive(true);
    setStepCount(0);
    setDistance(0);
    stepCountRef.current = 0;
    distanceRef.current = 0;

    // Start pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Start mock workout updates
    const interval = setInterval(() => {
      // Calculate new values using functional updates
      setStepCount((prev) => {
        const newSteps = prev + Math.floor(secureRandom() * 3) + 2;
        stepCountRef.current = newSteps;
        return newSteps;
      });

      setDistance((prev) => {
        const newDistance = prev + secureRandom() * 2 + 2;
        distanceRef.current = newDistance;

        // Create workout update with current ref values (always up-to-date)
        const update: WorkoutUpdate = {
          ts: Date.now(),
          steps: stepCountRef.current,
          distanceMeters: distanceRef.current,
          pace: 3.5, // Mock pace
          location: {
            lat: 37.7749 + (secureRandom() - 0.5) * 0.001,
            lon: -122.4194 + (secureRandom() - 0.5) * 0.001,
            accuracy: secureRandom() * 10 + 5,
          },
          source: 'ios',
        };

        setWorkoutData(update);
        return newDistance;
      });
    }, 1000);

    setWorkoutInterval(interval);
  };

  const stopWorkout = () => {
    setIsWorkoutActive(false);
    if (workoutInterval) {
      clearInterval(workoutInterval);
      setWorkoutInterval(null);
    }

    // Stop pulse animation
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);

    // Fade out animation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    return () => {
      if (workoutInterval) {
        clearInterval(workoutInterval);
      }
    };
  }, [workoutInterval]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary[600]} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Hello, Leovido</Text>
          <Text style={styles.headerSubtitle}>
            Last update: {workoutData ? 'Just now' : 'Never'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            style={[styles.claimButton, isWorkoutActive && styles.claimButtonActive]}
            onPress={isWorkoutActive ? stopWorkout : startWorkout}
            accessibilityLabel={isWorkoutActive ? 'Stop workout' : 'Start workout'}
            accessibilityRole="button"
            testID="workout-toggle-button"
          >
            <Text style={styles.claimButtonText}>{isWorkoutActive ? 'Stop' : 'Start'}</Text>
          </Pressable>
          <Pressable
            style={styles.searchButton}
            accessibilityLabel="Search"
            accessibilityRole="button"
          >
            <Text style={styles.searchIcon}>🔍</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Workout Card */}
        <Animated.View
          style={[
            styles.mainCard,
            {
              transform: [{ scale: pulseAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={styles.profileSection}>
              <View style={styles.profileImage}>
                <Text style={styles.profileEmoji}>🏃‍♂️</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.cardTitle}>Your workout status is</Text>
                <Text style={styles.cardValue}>{isWorkoutActive ? 'Active' : 'Inactive'}</Text>
                <Text style={styles.cardSubtitle}>
                  {isWorkoutActive ? 'Keep it up!' : 'Ready to start?'}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Live Data Cards */}
        <View style={styles.cardsContainer}>
          <View style={styles.dataCard} testID="live-data-steps">
            <View style={styles.cardIconContainer}>
              <Text style={styles.cardIcon}>👟</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Steps</Text>
              <Text style={styles.cardNumber} testID="steps-value">
                {stepCount}
              </Text>
              <Text style={styles.cardUnit}>steps</Text>
            </View>
          </View>

          <View style={styles.dataCard} testID="live-data-distance">
            <View style={styles.cardIconContainer}>
              <Text style={styles.cardIcon}>📏</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Distance</Text>
              <Text style={styles.cardNumber} testID="distance-value">
                {distance.toFixed(1)}
              </Text>
              <Text style={styles.cardUnit}>meters</Text>
            </View>
          </View>

          <View style={styles.dataCard} testID="live-data-duration">
            <View style={styles.cardIconContainer}>
              <Text style={styles.cardIcon}>⏱️</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Duration</Text>
              <Text style={styles.cardNumber} testID="duration-value">
                {isWorkoutActive ? 'Live' : '0'}
              </Text>
              <Text style={styles.cardUnit} testID="duration-unit">
                {isWorkoutActive ? 'active' : 'minutes'}
              </Text>
            </View>
          </View>
        </View>

        {/* Detailed Data Card */}
        {workoutData && (
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Last Update Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailIcon}>⏰</Text>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue} testID="last-update-time">
                  {new Date(workoutData.ts).toLocaleTimeString()}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailIcon}>👟</Text>
                <Text style={styles.detailLabel}>Steps</Text>
                <Text style={styles.detailValue} testID="last-update-steps">
                  {workoutData.steps}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailIcon}>📏</Text>
                <Text style={styles.detailLabel}>Distance</Text>
                <Text style={styles.detailValue} testID="last-update-distance">
                  {workoutData.distanceMeters.toFixed(2)}m
                </Text>
              </View>

              {workoutData.pace && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>🏃</Text>
                  <Text style={styles.detailLabel}>Pace</Text>
                  <Text style={styles.detailValue} testID="last-update-pace">
                    {workoutData.pace.toFixed(2)} m/s
                  </Text>
                </View>
              )}

              {workoutData.location && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>📍</Text>
                  <Text style={styles.detailLabel}>Location</Text>
                  <Text style={styles.detailValue} testID="last-update-location">
                    {workoutData.location.lat.toFixed(4)}, {workoutData.location.lon.toFixed(4)}
                  </Text>
                </View>
              )}

              <View style={styles.detailItem}>
                <Text style={styles.detailIcon}>📱</Text>
                <Text style={styles.detailLabel}>Source</Text>
                <Text style={styles.detailValue} testID="last-update-source">
                  {workoutData.source}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Workout Status</Text>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: isWorkoutActive ? Colors.accent[500] : Colors.neutral[400] },
              ]}
            >
              <Text style={styles.statusDot}>●</Text>
            </View>
          </View>
          <Text style={styles.statusText}>
            {isWorkoutActive ? 'Workout is currently active' : 'Workout is not active'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },

  // Header Styles
  header: {
    backgroundColor: Colors.primary[600],
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadows.md,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.inverse,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary[200],
    fontWeight: Typography.fontWeight.medium,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  claimButton: {
    backgroundColor: Colors.accent[500],
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    minHeight: Accessibility.minTouchTarget,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  claimButtonActive: {
    backgroundColor: Colors.error,
  },
  claimButtonText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  searchButton: {
    backgroundColor: Colors.primary[500],
    width: Accessibility.minTouchTarget,
    height: Accessibility.minTouchTarget,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  searchIcon: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text.inverse,
  },

  // Content Styles
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },

  // Main Card Styles
  mainCard: {
    backgroundColor: Colors.neutral[0],
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadows.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  profileEmoji: {
    fontSize: 30,
  },
  profileInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  cardValue: {
    fontSize: Typography.fontSize['3xl'],
    color: Colors.primary[600],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    fontWeight: Typography.fontWeight.medium,
  },

  // Data Cards Container
  cardsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },

  // Individual Data Card
  dataCard: {
    flex: 1,
    backgroundColor: Colors.primary[600],
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    minHeight: 120,
    ...Shadows.md,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.accent[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardIcon: {
    fontSize: 20,
  },
  cardContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary[200],
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.xs,
  },
  cardNumber: {
    fontSize: Typography.fontSize['2xl'],
    color: Colors.text.inverse,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
  },
  cardUnit: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary[300],
    fontWeight: Typography.fontWeight.medium,
  },

  // Details Card
  detailsCard: {
    backgroundColor: Colors.neutral[0],
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  detailsTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  detailsGrid: {
    gap: Spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  detailIcon: {
    fontSize: Typography.fontSize.lg,
    marginRight: Spacing.md,
    width: 24,
    textAlign: 'center',
  },
  detailLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
    flex: 1,
  },
  detailValue: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.semibold,
  },

  // Status Card
  statusCard: {
    backgroundColor: Colors.neutral[0],
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.md,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  statusTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    fontSize: 8,
    color: Colors.text.inverse,
  },
  statusText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
});
