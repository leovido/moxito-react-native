import { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [workoutStarted, setWorkoutStarted] = useState(false);

  const handleStartWorkout = async () => {
    try {
      // Lazy import to prevent Health Connect module initialization on screen load
      const { healthDataService } = await import('@moxito/services');

      // Request Health Connect permissions when starting workout
      if (healthDataService.platform === 'android') {
        try {
          const authorized = await healthDataService.requestAuthorization();
          if (!authorized) {
            // If permissions weren't granted, try opening Health Connect settings
            // But still allow the workout to start - user can grant permissions later
            console.log('Health Connect permissions not granted, opening settings...');
            try {
              await healthDataService.openHealthConnectSettings();
            } catch (settingsError) {
              console.warn('Failed to open Health Connect settings', settingsError);
            }
            // Continue with workout anyway - permissions can be granted later
          }
        } catch (error) {
          console.warn('Failed to request Health Connect permissions', error);
          // Continue anyway - user can grant permissions later
        }
      } else if (healthDataService.platform === 'ios') {
        try {
          await healthDataService.requestAuthorization();
        } catch (error) {
          console.warn('Failed to request HealthKit permissions', error);
        }
      }

      setWorkoutStarted(true);
      console.log('Start Workout');
    } catch (error) {
      console.error('Error starting workout:', error);
      // Still allow workout to start even if there's an error
      setWorkoutStarted(true);
    }
  };

  const handleViewStats = () => {
    console.log('View Stats');
  };

  const handleViewHistory = () => {
    console.log('View History');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Workout Dashboard</Text>
          <Text style={styles.subtitle}>Ready to crush your fitness goals?</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Pressable style={styles.primaryButton} onPress={handleStartWorkout}>
            <Text style={styles.primaryButtonText}>
              {workoutStarted ? 'Continue Workout' : 'Start Workout'}
            </Text>
          </Pressable>

          <View style={styles.secondaryActions}>
            <Pressable style={styles.secondaryButton} onPress={handleViewStats}>
              <Text style={styles.secondaryButtonText}>View Stats</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={handleViewHistory}>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#CCCCCC',
  },
  quickActions: {
    padding: 20,
    gap: 20,
  },
  primaryButton: {
    backgroundColor: '#9747FF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 16,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#333333',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  recentActivity: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  activityCard: {
    backgroundColor: '#333333',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  activityText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  activitySubtext: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
  },
});
