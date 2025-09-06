import type { IWorkoutEngine, WorkoutPermissions, WorkoutUpdate } from '@moxito/api';

// Simple event emitter for development
class SimpleEventEmitter {
  private listeners: Map<string, ((data: unknown) => void)[]> = new Map();

  addListener(event: string, callback: (data: unknown) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);

    return {
      remove: () => {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
          const index = eventListeners.indexOf(callback);
          if (index > -1) {
            eventListeners.splice(index, 1);
          }
        }
      },
    };
  }

  emit(event: string, data: unknown) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => {
        callback(data);
      });
    }
  }
}

export class WorkoutEngineModule implements IWorkoutEngine {
  private eventEmitter = new SimpleEventEmitter();
  private isWorkoutActive = false;
  private lastUpdate: WorkoutUpdate | null = null;
  private mockInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Initialize mock data for development
    this.lastUpdate = {
      ts: Date.now(),
      steps: 0,
      distanceMeters: 0,
      pace: 0,
      location: null,
      source: 'ios', // Will be set based on platform
    };
  }

  async getPermissions(): Promise<WorkoutPermissions> {
    // Mock permissions for now - will be implemented natively
    return {
      hasLocation: true,
      hasMotion: true,
      hasHealthWrite: true,
      hasHealthRead: true,
    };
  }

  async requestPermissions(): Promise<WorkoutPermissions> {
    // Mock permissions for now - will be implemented natively
    return {
      hasLocation: true,
      hasMotion: true,
      hasHealthWrite: true,
      hasHealthRead: true,
    };
  }

  async startWorkout(opts?: {
    activityType?: 'running' | 'walking';
    highAccuracy?: boolean;
  }): Promise<void> {
    if (this.isWorkoutActive) {
      throw new Error('Workout already active');
    }

    this.isWorkoutActive = true;

    // Start mock data generation for development
    this.startMockUpdates(opts?.activityType || 'running');

    console.log('Workout started:', opts);
  }

  async stopWorkout(): Promise<void> {
    if (!this.isWorkoutActive) {
      throw new Error('No active workout');
    }

    this.isWorkoutActive = false;

    // Stop mock updates
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
    }

    console.log('Workout stopped');
  }

  onUpdate(cb: (u: WorkoutUpdate) => void): () => void {
    const subscription = this.eventEmitter.addListener('workoutUpdate', cb);

    return () => {
      subscription.remove();
    };
  }

  async getSnapshot(): Promise<WorkoutUpdate> {
    if (!this.lastUpdate) {
      throw new Error('No workout data available');
    }
    return this.lastUpdate;
  }

  async flushSummaryChunk(): Promise<void> {
    // Mock implementation - will write to HealthKit/Health Connect
    console.log('Flushing summary chunk');
  }

  async finalizeAndSave(params?: { includeRoute?: boolean }): Promise<void> {
    // Mock implementation - will finalize workout in HealthKit/Health Connect
    console.log('Finalizing and saving workout', params);
  }

  private startMockUpdates(activityType: 'running' | 'walking') {
    let stepCount = 0;
    let distance = 0;
    const startTime = Date.now();

    this.mockInterval = setInterval(() => {
      if (!this.isWorkoutActive) {
        return;
      }

      // Simulate realistic workout data
      const elapsed = (Date.now() - startTime) / 1000; // seconds

      if (activityType === 'running') {
        // Running: ~150-180 steps/min, ~3-4 m/s pace
        stepCount += Math.floor(Math.random() * 3) + 2; // 2-4 steps per update
        distance += Math.random() * 2 + 2; // 2-4 meters per update
      } else {
        // Walking: ~100-120 steps/min, ~1.2-1.5 m/s pace
        stepCount += Math.floor(Math.random() * 2) + 1; // 1-2 steps per update
        distance += Math.random() * 1 + 1; // 1-2 meters per update
      }

      const update: WorkoutUpdate = {
        ts: Date.now(),
        steps: stepCount,
        distanceMeters: Math.round(distance * 100) / 100, // Round to 2 decimal places
        pace: distance / elapsed,
        location: this.generateMockLocation(),
        source: 'ios', // Will be set based on platform
      };

      this.lastUpdate = update;
      this.eventEmitter.emit('workoutUpdate', update);
    }, 1000); // Update every second
  }

  private generateMockLocation() {
    // Generate mock GPS coordinates around a central point
    const baseLat = 37.7749; // San Francisco
    const baseLon = -122.4194;

    return {
      lat: baseLat + (Math.random() - 0.5) * 0.001, // ±0.0005 degrees
      lon: baseLon + (Math.random() - 0.5) * 0.001,
      accuracy: Math.random() * 10 + 5, // 5-15 meters accuracy
    };
  }
}

export default new WorkoutEngineModule();
