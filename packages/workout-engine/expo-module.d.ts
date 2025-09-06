import type { ConfigPlugin } from '@expo/config-plugins';

declare module '@expo/config-plugins' {
  interface ExpoConfig {
    workoutEngine?: {
      ios?: {
        backgroundModes?: string[];
        infoPlist?: Record<string, unknown>;
      };
      android?: {
        permissions?: string[];
        services?: string[];
      };
    };
  }
}

export interface WorkoutEngineConfig {
  ios?: {
    backgroundModes?: string[];
    infoPlist?: Record<string, unknown>;
  };
  android?: {
    permissions?: string[];
    services?: string[];
  };
}

export const withWorkoutEngine: ConfigPlugin<WorkoutEngineConfig>;
