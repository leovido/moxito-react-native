// Mock workout data generation utilities
export interface WorkoutUpdate {
  ts: number;
  steps: number;
  distanceMeters: number;
  pace?: number;
  location?: { lat: number; lon: number; accuracy: number } | null;
  source: 'ios' | 'android';
}

export const generateMockWorkoutUpdate = (baseData: Partial<WorkoutUpdate> = {}): WorkoutUpdate => {
  const now = Date.now();
  return {
    ts: baseData.ts || now,
    steps: baseData.steps || Math.floor(Math.random() * 100) + 50,
    distanceMeters: baseData.distanceMeters || Math.random() * 200 + 50,
    pace: baseData.pace || Math.random() * 2 + 1,
    location: baseData.location || {
      lat: 37.7749 + (Math.random() - 0.5) * 0.001,
      lon: -122.4194 + (Math.random() - 0.5) * 0.001,
      accuracy: Math.random() * 10 + 5,
    },
    source: baseData.source || 'ios',
  };
};

export const calculatePace = (distanceMeters: number, elapsedSeconds: number): number => {
  if (elapsedSeconds === 0) {
    return 0;
  }
  return distanceMeters / elapsedSeconds;
};

export const validateWorkoutUpdate = (update: WorkoutUpdate): boolean => {
  return !!(
    typeof update.ts === 'number' &&
    update.ts > 0 &&
    typeof update.steps === 'number' &&
    update.steps >= 0 &&
    typeof update.distanceMeters === 'number' &&
    update.distanceMeters >= 0 &&
    (update.pace === undefined || (typeof update.pace === 'number' && update.pace >= 0)) &&
    (update.location === null ||
      (update.location &&
        typeof update.location.lat === 'number' &&
        typeof update.location.lon === 'number' &&
        typeof update.location.accuracy === 'number' &&
        update.location.accuracy > 0)) &&
    (update.source === 'ios' || update.source === 'android')
  );
};
