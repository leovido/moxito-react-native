import type { WorkoutUpdate } from '../workout';
import {
  addWorkoutUpdate,
  calculateWorkoutStats,
  createInitialWorkoutState,
  startWorkout,
  stopWorkout,
} from './workout-state-utils';

describe('Workout State Management', () => {
  describe('createInitialWorkoutState', () => {
    it('creates initial state with default goal', () => {
      const state = createInitialWorkoutState();

      expect(state.isActive).toBe(false);
      expect(state.startTime).toBeNull();
      expect(state.currentSteps).toBe(0);
      expect(state.currentDistance).toBe(0);
      expect(state.updates).toHaveLength(0);
      expect(state.goalDistance).toBe(1000);
      expect(state.isGoalReached).toBe(false);
    });

    it('creates initial state with custom goal', () => {
      const state = createInitialWorkoutState(5000);

      expect(state.goalDistance).toBe(5000);
    });
  });

  describe('startWorkout', () => {
    it('activates workout state', () => {
      const initialState = createInitialWorkoutState();
      const newState = startWorkout(initialState);

      expect(newState.isActive).toBe(true);
      expect(newState.startTime).toBeGreaterThan(0);
      expect(newState.currentSteps).toBe(0);
      expect(newState.currentDistance).toBe(0);
      expect(newState.updates).toHaveLength(0);
      expect(newState.isGoalReached).toBe(false);
    });

    it('resets workout data when starting', () => {
      const initialState = createInitialWorkoutState();
      initialState.currentSteps = 100;
      initialState.currentDistance = 500;
      initialState.updates = [{ ts: Date.now(), steps: 100, distanceMeters: 500, source: 'ios' }];

      const newState = startWorkout(initialState);

      expect(newState.currentSteps).toBe(0);
      expect(newState.currentDistance).toBe(0);
      expect(newState.updates).toHaveLength(0);
    });
  });

  describe('stopWorkout', () => {
    it('deactivates workout state', () => {
      const activeState = createInitialWorkoutState();
      activeState.isActive = true;
      activeState.startTime = Date.now();

      const newState = stopWorkout(activeState);

      expect(newState.isActive).toBe(false);
      expect(newState.startTime).toBeNull();
    });

    it('preserves workout data when stopping', () => {
      const activeState = createInitialWorkoutState();
      activeState.isActive = true;
      activeState.startTime = Date.now();
      activeState.currentSteps = 150;
      activeState.currentDistance = 750;
      activeState.updates = [{ ts: Date.now(), steps: 150, distanceMeters: 750, source: 'ios' }];

      const newState = stopWorkout(activeState);

      expect(newState.currentSteps).toBe(150);
      expect(newState.currentDistance).toBe(750);
      expect(newState.updates).toHaveLength(1);
    });
  });

  describe('addWorkoutUpdate', () => {
    it('adds update to active workout', () => {
      const activeState = createInitialWorkoutState();
      activeState.isActive = true;
      activeState.startTime = Date.now();

      const update: WorkoutUpdate = {
        ts: Date.now(),
        steps: 100,
        distanceMeters: 500,
        source: 'ios',
      };

      const newState = addWorkoutUpdate(activeState, update);

      expect(newState.updates).toHaveLength(1);
      expect(newState.currentSteps).toBe(100);
      expect(newState.currentDistance).toBe(500);
    });

    it('ignores updates for inactive workout', () => {
      const inactiveState = createInitialWorkoutState();
      inactiveState.isActive = false;

      const update: WorkoutUpdate = {
        ts: Date.now(),
        steps: 100,
        distanceMeters: 500,
        source: 'ios',
      };

      const newState = addWorkoutUpdate(inactiveState, update);

      expect(newState).toBe(inactiveState);
    });

    it('marks goal as reached when distance exceeds goal', () => {
      const activeState = createInitialWorkoutState(1000); // 1km goal
      activeState.isActive = true;
      activeState.startTime = Date.now();

      const update: WorkoutUpdate = {
        ts: Date.now(),
        steps: 200,
        distanceMeters: 1200, // Exceeds 1km goal
        source: 'ios',
      };

      const newState = addWorkoutUpdate(activeState, update);

      expect(newState.isGoalReached).toBe(true);
    });

    it('does not mark goal as reached multiple times', () => {
      const activeState = createInitialWorkoutState(1000);
      activeState.isActive = true;
      activeState.startTime = Date.now();
      activeState.isGoalReached = true; // Already reached

      const update: WorkoutUpdate = {
        ts: Date.now(),
        steps: 300,
        distanceMeters: 1500,
        source: 'ios',
      };

      const newState = addWorkoutUpdate(activeState, update);

      expect(newState.isGoalReached).toBe(true); // Should remain true
    });
  });

  describe('calculateWorkoutStats', () => {
    it('returns zero stats for inactive workout', () => {
      const inactiveState = createInitialWorkoutState();
      const stats = calculateWorkoutStats(inactiveState);

      expect(stats.duration).toBe(0);
      expect(stats.averagePace).toBe(0);
      expect(stats.totalSteps).toBe(0);
      expect(stats.totalDistance).toBe(0);
      expect(stats.goalProgress).toBe(0);
    });

    it('calculates stats for active workout', () => {
      const activeState = createInitialWorkoutState(1000);
      activeState.isActive = true;
      activeState.startTime = Date.now() - 60000; // Started 1 minute ago
      activeState.currentSteps = 120;
      activeState.currentDistance = 600;
      activeState.updates = [{ ts: Date.now(), steps: 120, distanceMeters: 600, source: 'ios' }];

      const stats = calculateWorkoutStats(activeState);

      expect(stats.duration).toBe(60000); // 1 minute in ms
      expect(stats.averagePace).toBe(10); // 600m / 60s = 10 m/s
      expect(stats.totalSteps).toBe(120);
      expect(stats.totalDistance).toBe(600);
      expect(stats.goalProgress).toBe(60); // 600/1000 * 100 = 60%
    });

    it('caps goal progress at 100%', () => {
      const activeState = createInitialWorkoutState(1000);
      activeState.isActive = true;
      activeState.startTime = Date.now() - 60000;
      activeState.currentSteps = 200;
      activeState.currentDistance = 1200; // Exceeds goal
      activeState.updates = [{ ts: Date.now(), steps: 200, distanceMeters: 1200, source: 'ios' }];

      const stats = calculateWorkoutStats(activeState);

      expect(stats.goalProgress).toBe(100); // Capped at 100%
    });

    it('handles zero duration gracefully', () => {
      const activeState = createInitialWorkoutState(1000);
      activeState.isActive = true;
      activeState.startTime = Date.now(); // Just started
      activeState.currentSteps = 0;
      activeState.currentDistance = 0;

      const stats = calculateWorkoutStats(activeState);

      expect(stats.averagePace).toBe(0);
    });
  });

  describe('Workout State Transitions', () => {
    it('handles complete workout lifecycle', () => {
      let state = createInitialWorkoutState(1000);

      // Start workout
      state = startWorkout(state);
      expect(state.isActive).toBe(true);
      expect(state.startTime).toBeTruthy();

      // Add updates
      const update1: WorkoutUpdate = {
        ts: Date.now(),
        steps: 60,
        distanceMeters: 300,
        source: 'ios',
      };
      state = addWorkoutUpdate(state, update1);
      expect(state.currentSteps).toBe(60);
      expect(state.currentDistance).toBe(300);
      expect(state.isGoalReached).toBe(false);

      const update2: WorkoutUpdate = {
        ts: Date.now(),
        steps: 120,
        distanceMeters: 600,
        source: 'ios',
      };
      state = addWorkoutUpdate(state, update2);
      expect(state.currentSteps).toBe(120);
      expect(state.currentDistance).toBe(600);
      expect(state.isGoalReached).toBe(false);

      const update3: WorkoutUpdate = {
        ts: Date.now(),
        steps: 200,
        distanceMeters: 1200,
        source: 'ios',
      };
      state = addWorkoutUpdate(state, update3);
      expect(state.isGoalReached).toBe(true);

      // Ensure we have updates for stats calculation
      expect(state.updates).toHaveLength(3);

      // Stop workout
      state = stopWorkout(state);
      expect(state.isActive).toBe(false);
      expect(state.startTime).toBeNull();

      // Stats should be preserved
      const stats = calculateWorkoutStats(state);
      expect(stats.totalSteps).toBe(200);
      expect(stats.totalDistance).toBe(1200);
    });
  });
});
