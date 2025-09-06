import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

// Temporary mock types for testing
type WorkoutUpdate = {
  ts: number;
  steps: number;
  distanceMeters: number;
  pace?: number;
  location?: { lat: number; lon: number; accuracy: number } | null;
  source: 'ios' | 'android';
};

export default function WorkoutScreen() {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutData, setWorkoutData] = useState<WorkoutUpdate | null>(null);
  const [stepCount, setStepCount] = useState(0);
  const [distance, setDistance] = useState(0);
  const [workoutInterval, setWorkoutInterval] = useState<NodeJS.Timeout | null>(null);

  const startWorkout = () => {
    setIsWorkoutActive(true);
    setStepCount(0);
    setDistance(0);

    // Start mock workout updates
    const interval = setInterval(() => {
      setStepCount((prev) => prev + Math.floor(Math.random() * 3) + 2);
      setDistance((prev) => prev + Math.random() * 2 + 2);

      const update: WorkoutUpdate = {
        ts: Date.now(),
        steps: stepCount + Math.floor(Math.random() * 3) + 2,
        distanceMeters: distance + Math.random() * 2 + 2,
        pace: 3.5, // Mock pace
        location: {
          lat: 37.7749 + (Math.random() - 0.5) * 0.001,
          lon: -122.4194 + (Math.random() - 0.5) * 0.001,
          accuracy: Math.random() * 10 + 5,
        },
        source: 'ios',
      };

      setWorkoutData(update);
    }, 1000);

    setWorkoutInterval(interval);
  };

  const stopWorkout = () => {
    setIsWorkoutActive(false);
    if (workoutInterval) {
      clearInterval(workoutInterval);
      setWorkoutInterval(null);
    }
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
      <View style={styles.content}>
        <Text style={styles.title}>Workout Tracking</Text>

        {/* Workout Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout Controls</Text>
          <View style={styles.buttonRow}>
            {!isWorkoutActive ? (
              <Pressable style={[styles.button, styles.startButton]} onPress={startWorkout}>
                <Text style={styles.buttonText}>Start Workout</Text>
              </Pressable>
            ) : (
              <Pressable style={[styles.button, styles.stopButton]} onPress={stopWorkout}>
                <Text style={styles.buttonText}>Stop Workout</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Live Workout Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Data</Text>
          <View style={styles.dataGrid}>
            <Text style={styles.dataItem}>👟 Steps: {stepCount}</Text>
            <Text style={styles.dataItem}>📏 Distance: {distance.toFixed(2)}m</Text>
            <Text style={styles.dataItem}>
              ⏱️ Duration: {isWorkoutActive ? 'Active' : 'Stopped'}
            </Text>
          </View>
        </View>

        {/* Workout Data */}
        {workoutData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Last Update</Text>
            <View style={styles.dataGrid}>
              <Text style={styles.dataItem}>
                ⏰ Time: {new Date(workoutData.ts).toLocaleTimeString()}
              </Text>
              <Text style={styles.dataItem}>👟 Steps: {workoutData.steps}</Text>
              <Text style={styles.dataItem}>
                📏 Distance: {workoutData.distanceMeters.toFixed(2)}m
              </Text>
              {workoutData.pace && (
                <Text style={styles.dataItem}>🏃 Pace: {workoutData.pace.toFixed(2)} m/s</Text>
              )}
              {workoutData.location && (
                <Text style={styles.dataItem}>
                  📍 Location: {workoutData.location.lat.toFixed(6)},{' '}
                  {workoutData.location.lon.toFixed(6)}
                </Text>
              )}
              <Text style={styles.dataItem}>📱 Source: {workoutData.source}</Text>
            </View>
          </View>
        )}

        {/* Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <Text style={styles.statusText}>
            Workout: {isWorkoutActive ? '🟢 Active' : '🔴 Inactive'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 15,
  },
  button: {
    backgroundColor: '#9747FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dataGrid: {
    gap: 8,
  },
  dataItem: {
    fontSize: 16,
    color: '#666',
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
});
