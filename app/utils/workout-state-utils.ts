import type { WorkoutUpdate } from '@moxito/api';

// Workout state management utilities
export interface WorkoutState {
  isActive: boolean;
  startTime: number | null;
  currentSteps: number;
  currentDistance: number;
  goalDistance: number;
  updates: WorkoutUpdate[];
  isGoalReached: boolean;
}

export const createInitialWorkoutState = (goalDistance: number = 1000): WorkoutState => ({
  isActive: false,
  startTime: null,
  currentSteps: 0,
  currentDistance: 0,
  goalDistance,
  updates: [],
  isGoalReached: false,
});

export const startWorkout = (state: WorkoutState): WorkoutState => ({
  ...state,
  isActive: true,
  startTime: Date.now(),
  currentSteps: 0,
  currentDistance: 0,
  updates: [],
  isGoalReached: false,
});

export const stopWorkout = (state: WorkoutState): WorkoutState => ({
  ...state,
  isActive: false,
  // Keep startTime for stats calculation
});

export const addWorkoutUpdate = (state: WorkoutState, update: WorkoutUpdate): WorkoutState => {
  if (!state.isActive) {
    return state;
  }

  const newState = {
    ...state,
    currentSteps: update.steps,
    currentDistance: update.distanceMeters,
    updates: [...state.updates, update],
  };

  // Check if goal is reached
  if (update.distanceMeters >= state.goalDistance && !state.isGoalReached) {
    newState.isGoalReached = true;
  }

  return newState;
};

export const calculateWorkoutStats = (state: WorkoutState) => {
  if (!state.startTime || state.updates.length === 0) {
    return {
      duration: 0,
      totalSteps: 0,
      totalDistance: 0,
      averagePace: 0,
      goalProgress: 0,
    };
  }

  const duration = state.isActive ? Date.now() - state.startTime : 0;
  const totalSteps = state.currentSteps;
  const totalDistance = state.currentDistance;
  const averagePace = duration > 0 ? totalDistance / (duration / 1000) : 0;
  const goalProgress = Math.min((totalDistance / state.goalDistance) * 100, 100);

  return {
    duration,
    totalSteps,
    totalDistance,
    averagePace,
    goalProgress,
  };
};
