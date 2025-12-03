import type { WorkoutUpdate } from '@moxito/api';
import {
  calculatePace,
  generateMockWorkoutUpdate,
  validateWorkoutUpdate,
} from '../../utils/workout-utils-helpers';

describe('Workout Utilities', () => {
  describe('generateMockWorkoutUpdate', () => {
    it('generates valid workout update with default values', () => {
      const update = generateMockWorkoutUpdate();

      expect(update).toHaveProperty('ts');
      expect(update).toHaveProperty('steps');
      expect(update).toHaveProperty('distanceMeters');
      expect(update).toHaveProperty('pace');
      expect(update).toHaveProperty('location');
      expect(update).toHaveProperty('source');

      expect(update.ts).toBeGreaterThan(0);
      expect(update.steps).toBeGreaterThan(0);
      expect(update.distanceMeters).toBeGreaterThan(0);
      expect(update.pace).toBeGreaterThan(0);
      expect(update.location).toBeTruthy();
      expect(['ios', 'android']).toContain(update.source);
    });

    it('overrides default values with provided data', () => {
      const customData = {
        steps: 500,
        distanceMeters: 1000,
        source: 'android' as const,
      };

      const update = generateMockWorkoutUpdate(customData);

      expect(update.steps).toBe(500);
      expect(update.distanceMeters).toBe(1000);
      expect(update.source).toBe('android');
    });

    it('generates realistic GPS coordinates', () => {
      const update = generateMockWorkoutUpdate();

      expect(update.location).toBeTruthy();
      if (update.location) {
        // Should be around San Francisco
        expect(update.location.lat).toBeGreaterThan(37.7744);
        expect(update.location.lat).toBeLessThan(37.7754);
        expect(update.location.lon).toBeGreaterThan(-122.4199);
        expect(update.location.lon).toBeLessThan(-122.4189);
        expect(update.location.accuracy).toBeGreaterThan(5);
        expect(update.location.accuracy).toBeLessThan(15);
      }
    });
  });

  describe('calculatePace', () => {
    it('calculates pace correctly', () => {
      expect(calculatePace(100, 20)).toBe(5); // 5 m/s
      expect(calculatePace(1000, 100)).toBe(10); // 10 m/s
      expect(calculatePace(0, 10)).toBe(0); // 0 m/s
    });

    it('handles zero elapsed time', () => {
      expect(calculatePace(100, 0)).toBe(0);
    });

    it('handles negative values gracefully', () => {
      expect(calculatePace(-100, 20)).toBe(-5);
      expect(calculatePace(100, -20)).toBe(-5);
    });
  });

  describe('validateWorkoutUpdate', () => {
    it('validates correct workout update', () => {
      const validUpdate: WorkoutUpdate = {
        ts: Date.now(),
        steps: 100,
        distanceMeters: 500,
        pace: 2.5,
        location: {
          lat: 37.7749,
          lon: -122.4194,
          accuracy: 10,
        },
        source: 'ios',
      };

      expect(validateWorkoutUpdate(validUpdate)).toBe(true);
    });

    it('rejects invalid timestamp', () => {
      const invalidUpdate: WorkoutUpdate = {
        ts: 0,
        steps: 100,
        distanceMeters: 500,
        source: 'ios',
      };

      expect(validateWorkoutUpdate(invalidUpdate)).toBe(false);
    });

    it('rejects negative steps', () => {
      const invalidUpdate: WorkoutUpdate = {
        ts: Date.now(),
        steps: -10,
        distanceMeters: 500,
        source: 'ios',
      };

      expect(validateWorkoutUpdate(invalidUpdate)).toBe(false);
    });

    it('rejects negative distance', () => {
      const invalidUpdate: WorkoutUpdate = {
        ts: Date.now(),
        steps: 100,
        distanceMeters: -100,
        source: 'ios',
      };

      expect(validateWorkoutUpdate(invalidUpdate)).toBe(false);
    });

    it('rejects invalid source', () => {
      const invalidUpdate: WorkoutUpdate = {
        ts: Date.now(),
        steps: 100,
        distanceMeters: 500,
        source: 'invalid' as 'ios' | 'android',
      };

      const result = validateWorkoutUpdate(invalidUpdate);
      expect(result).toBe(false);
    });

    it('accepts null location', () => {
      const validUpdate: WorkoutUpdate = {
        ts: Date.now(),
        steps: 100,
        distanceMeters: 500,
        location: null,
        source: 'ios',
      };

      expect(validateWorkoutUpdate(validUpdate)).toBe(true);
    });

    it('rejects invalid location data', () => {
      const invalidUpdate: WorkoutUpdate = {
        ts: Date.now(),
        steps: 100,
        distanceMeters: 500,
        location: {
          lat: 'invalid' as unknown as number,
          lon: -122.4194,
          accuracy: 10,
        },
        source: 'ios',
      };

      expect(validateWorkoutUpdate(invalidUpdate)).toBe(false);
    });
  });

  describe('Workout Data Consistency', () => {
    it('maintains data consistency across multiple updates', () => {
      const updates: WorkoutUpdate[] = [];

      // Generate 10 consecutive updates with increasing values
      for (let i = 0; i < 10; i++) {
        const update = generateMockWorkoutUpdate({
          steps: (i + 1) * 10, // Start from 10, not 0
          distanceMeters: (i + 1) * 100, // Start from 100, not 0
        });
        updates.push(update);
      }

      // All updates should be valid
      updates.forEach((update) => {
        expect(validateWorkoutUpdate(update)).toBe(true);
      });

      // Steps should increase
      for (let i = 1; i < updates.length; i++) {
        expect(updates[i].steps).toBeGreaterThan(updates[i - 1].steps);
        expect(updates[i].distanceMeters).toBeGreaterThan(updates[i - 1].distanceMeters);
      }
    });

    it('generates realistic workout progression', () => {
      const startTime = Date.now();
      const updates: WorkoutUpdate[] = [];

      // Simulate 5 minutes of workout
      for (let i = 0; i < 5; i++) {
        const update = generateMockWorkoutUpdate({
          ts: startTime + i * 60 * 1000, // Each minute
          steps: (i + 1) * 120, // 120 steps per minute (walking pace), start from 1
          distanceMeters: (i + 1) * 100, // 100 meters per minute, start from 1
        });
        updates.push(update);
      }

      // Check realistic progression
      expect(updates[4].steps).toBe(600); // 5 * 120
      expect(updates[4].distanceMeters).toBe(500); // 5 * 100

      // Time progression - ensure we have different timestamps
      expect(updates[4].ts).toBeGreaterThan(updates[0].ts);
      expect(updates[4].ts - updates[0].ts).toBe(4 * 60 * 1000); // 4 minutes
    });
  });
});
