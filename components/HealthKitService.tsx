import { NativeModules } from 'react-native';

const { HealthKitManager } = NativeModules;

interface HealthKitService {
  requestAuthorization(): Promise<boolean>;
  getStepCount(startDate: Date, endDate: Date): Promise<number>;
  fetchHealthDataForDateRange(startDate: Date, endDate: Date): Promise<unknown>;
  checkNoManualInput(): Promise<boolean>;
  fetchCaloriesBurned(startDate: Date, endDate: Date): Promise<number>;
  getRestingHeartRateForMonth(startDate: Date, endDate: Date): Promise<number>;
  getAverageHeartRate(startDate: Date, endDate: Date): Promise<number>;
  fetchDistance(startDate: Date, endDate: Date): Promise<number>;
  getTodayStepCount(startDate: Date, endDate: Date): Promise<number>;
  fetchWorkouts(startDate: Date, endDate: Date): Promise<unknown>;
  fetchAvgHRWorkouts(startDate: Date, endDate: Date): Promise<unknown>;
}

export const healthKitService: HealthKitService = {
  requestAuthorization: async () => {
    try {
      return await HealthKitManager.requestAuthorization();
    } catch (error) {
      console.error('HealthKit authorization failed:', error);
      throw error;
    }
  },

  getStepCount: async (startDate: Date, endDate: Date) => {
    try {
      return await HealthKitManager.getStepCount(startDate, endDate);
    } catch (error) {
      console.error('Failed to fetch step count:', error);
      throw error;
    }
  },

  fetchHealthDataForDateRange: async (startDate: Date, endDate: Date) => {
    try {
      return await HealthKitManager.fetchHealthDataForDateRange(startDate, endDate);
    } catch (error) {
      console.error('Failed to fetch health data:', error);
      throw error;
    }
  },

  checkNoManualInput: async () => {
    try {
      return await HealthKitManager.checkNoManualInput();
    } catch (error) {
      console.error('Failed to check manual input:', error);
      throw error;
    }
  },

  fetchCaloriesBurned: async (startDate: Date, endDate: Date) => {
    try {
      return await HealthKitManager.fetchCaloriesBurned(startDate, endDate);
    } catch (error) {
      console.error('Failed to fetch calories burned:', error);
      throw error;
    }
  },

  getRestingHeartRateForMonth: async (startDate: Date, endDate: Date) => {
    try {
      return await HealthKitManager.getRestingHeartRateForMonth(startDate, endDate);
    } catch (error) {
      console.error('Failed to fetch resting heart rate:', error);
      throw error;
    }
  },

  getAverageHeartRate: async (startDate: Date, endDate: Date) => {
    try {
      return await HealthKitManager.getAverageHeartRate(startDate, endDate);
    } catch (error) {
      console.error('Failed to fetch average heart rate:', error);
      throw error;
    }
  },

  fetchDistance: async (startDate: Date, endDate: Date) => {
    try {
      return await HealthKitManager.fetchDistance(startDate, endDate);
    } catch (error) {
      console.error('Failed to fetch distance:', error);
      throw error;
    }
  },

  getTodayStepCount: async (startDate: Date, endDate: Date) => {
    try {
      return await HealthKitManager.getTodayStepCount(startDate, endDate);
    } catch (error) {
      console.error("Failed to fetch today's step count:", error);
      throw error;
    }
  },

  fetchWorkouts: async (startDate: Date, endDate: Date) => {
    try {
      return await HealthKitManager.fetchWorkouts(startDate, endDate);
    } catch (error) {
      console.error('Failed to fetch workouts:', error);
      throw error;
    }
  },

  fetchAvgHRWorkouts: async (startDate: Date, endDate: Date) => {
    try {
      return await HealthKitManager.fetchAvgHRWorkouts(startDate, endDate);
    } catch (error) {
      console.error('Failed to fetch workout heart rates:', error);
      throw error;
    }
  },
};
