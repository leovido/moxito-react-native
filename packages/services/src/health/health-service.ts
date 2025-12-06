import { NativeModules, Platform } from 'react-native';

import { healthKitService } from '@/components/HealthKitService';

import type { HealthDailySummary, HealthIntegration, HealthSource } from './types';

type HealthConnectModule = {
  isAvailable?: () => Promise<boolean>;
  requestAuthorization?: () => Promise<boolean>;
  openHealthConnectSettings?: () => Promise<boolean>;
  getDailySteps?: (dateIso: string) => Promise<number>;
  getDailyDistanceKilometers?: (dateIso: string) => Promise<number>;
  getDailyDistanceMeters?: (dateIso: string) => Promise<number>;
  getAverageHeartRate?: (dateIso: string) => Promise<number>;
};

// Don't access NativeModules at module level - use lazy getter instead

function getDayRange(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function normalizeSteps(value: unknown) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0;
  }
  return Math.max(0, Math.round(value));
}

function normalizeHeartRate(value: unknown) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0;
  }
  return Math.max(0, Math.round(value));
}

function normalizeDistance(value: unknown) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0;
  }
  const kilometers = value > 500 ? value / 1000 : value;
  return Number(kilometers.toFixed(2));
}

function createMockSummary(date: Date, source: HealthSource = 'mock'): HealthDailySummary {
  const seed = date.getDate();
  const steps = 6500 + ((seed * 137) % 4000);
  const distanceKm = normalizeDistance(steps * 0.0008);
  const heartRateBpm = 60 + ((seed % 5) + 1) * 3;

  return {
    date,
    steps,
    heartRateBpm,
    distanceKm,
    source,
  };
}

const iosProvider: HealthIntegration = {
  platform: 'ios',
  canUse: () => Platform.OS === 'ios',
  requestAuthorization: async () => {
    try {
      return await healthKitService.requestAuthorization();
    } catch (error) {
      console.warn('HealthKit authorization failed, continuing with mock data', error);
      return false;
    }
  },
  getDailySummary: async (date: Date) => {
    const { start, end } = getDayRange(date);

    try {
      const [steps, distance, heartRate] = await Promise.all([
        healthKitService.getTodayStepCount(start, end),
        healthKitService.fetchDistance(start, end),
        healthKitService.getAverageHeartRate(start, end),
      ]);

      return {
        date,
        steps: normalizeSteps(steps),
        heartRateBpm: normalizeHeartRate(heartRate),
        distanceKm: normalizeDistance(distance),
        source: 'ios',
      };
    } catch (error) {
      console.warn('Failed to read HealthKit data, serving mock stats', error);
      return createMockSummary(date, 'ios');
    }
  },
};

const androidProvider: HealthIntegration = {
  platform: 'android',
  canUse: () => {
    if (Platform.OS !== 'android') {
      return false;
    }
    // Don't check HealthConnectManager here to avoid module initialization
    // Just return true if we're on Android - actual check happens in requestAuthorization
    return true;
  },
  requestAuthorization: async () => {
    const manager = getHealthConnectManager();
    if (!manager?.requestAuthorization) {
      // Module not available, return false to indicate Health Connect is not set up
      return false;
    }

    try {
      // First check if Health Connect is available
      const isAvailable = await manager.isAvailable?.().catch(() => false);
      if (!isAvailable) {
        console.warn('Health Connect is not available on this device');
        return false;
      }

      return await manager.requestAuthorization();
    } catch (error) {
      console.warn('Health Connect authorization failed, continuing with mock data', error);
      return false;
    }
  },
  getDailySummary: async (date: Date) => {
    const manager = getHealthConnectManager();
    if (!manager) {
      return createMockSummary(date, 'android');
    }

    const dateIso = date.toISOString();

    try {
      // Check availability first
      const isAvailable = await manager.isAvailable?.().catch(() => false);
      if (!isAvailable) {
        console.warn('Health Connect is not available, serving mock stats');
        return createMockSummary(date, 'android');
      }

      const [steps, distanceValue, heartRate] = await Promise.all([
        manager.getDailySteps?.(dateIso) ?? Promise.resolve(0),
        manager.getDailyDistanceKilometers?.(dateIso) ??
          manager.getDailyDistanceMeters?.(dateIso) ??
          Promise.resolve(0),
        manager.getAverageHeartRate?.(dateIso) ?? Promise.resolve(0),
      ]);

      return {
        date,
        steps: normalizeSteps(steps),
        heartRateBpm: normalizeHeartRate(heartRate),
        distanceKm: normalizeDistance(distanceValue),
        source: 'android',
      };
    } catch (error) {
      console.warn('Failed to read Health Connect data, serving mock stats', error);
      return createMockSummary(date, 'android');
    }
  },
};

const fallbackProvider: HealthIntegration = {
  platform: 'mock',
  canUse: () => true,
  requestAuthorization: async () => true,
  getDailySummary: async (date: Date) => createMockSummary(date),
};

const activeProvider =
  Platform.select<HealthIntegration>({
    ios: iosProvider,
    android: androidProvider,
    default: fallbackProvider,
  }) ?? fallbackProvider;

// Lazy getter for HealthConnectManager to avoid module initialization on import
function getHealthConnectManager(): HealthConnectModule | undefined {
  try {
    return (NativeModules as { HealthConnectManager?: HealthConnectModule }).HealthConnectManager;
  } catch {
    return undefined;
  }
}

export const healthDataService = {
  get platform() {
    return activeProvider.platform;
  },
  canUse: () => activeProvider.canUse(),
  requestAuthorization: () => activeProvider.requestAuthorization(),
  getDailySummary: (date = new Date()) => activeProvider.getDailySummary(date),
  openHealthConnectSettings: async () => {
    if (Platform.OS !== 'android') {
      return false;
    }
    const manager = getHealthConnectManager();
    if (!manager?.openHealthConnectSettings) {
      return false;
    }
    try {
      return await manager.openHealthConnectSettings();
    } catch (error) {
      console.warn('Failed to open Health Connect settings', error);
      return false;
    }
  },
};

export type HealthDataService = typeof healthDataService;
