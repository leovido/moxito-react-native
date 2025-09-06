// api/WorkoutEngine.ts
export type WorkoutUpdate = {
  ts: number; // ms since epoch
  steps: number; // total during session
  distanceMeters: number; // GPS-based, during session
  pace?: number; // m/s (optional live calc)
  location?: { lat: number; lon: number; accuracy: number } | null;
  source: 'ios' | 'android';
};

export type WorkoutPermissions = {
  hasLocation: boolean;
  hasMotion: boolean;
  hasHealthWrite: boolean;
  hasHealthRead: boolean;
};

export interface IWorkoutEngine {
  getPermissions(): Promise<WorkoutPermissions>;
  requestPermissions(): Promise<WorkoutPermissions>;
  startWorkout(opts?: {
    activityType?: 'running' | 'walking';
    highAccuracy?: boolean;
  }): Promise<void>;
  stopWorkout(): Promise<void>;
  onUpdate(cb: (u: WorkoutUpdate) => void): () => void; // unsubscribe
  getSnapshot(): Promise<WorkoutUpdate>; // last known
  // Health store sync (batched):
  flushSummaryChunk(): Promise<void>; // write partial
  finalizeAndSave(params?: { includeRoute?: boolean }): Promise<void>;
}

// This will be implemented by the native module
export const WorkoutEngine: IWorkoutEngine = {} as IWorkoutEngine;
