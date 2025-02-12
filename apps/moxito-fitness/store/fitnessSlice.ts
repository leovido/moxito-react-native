import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { healthKitService } from "@/components/HealthKitService";

interface FitnessData {
  steps: number;
  calories: number;
  distance: number;
  heartRate: {
    resting: number;
    average: number;
  };
  workouts: unknown[];
  lastUpdated: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: FitnessData = {
  steps: 5000,
  calories: 300,
  distance: 4.2,
  heartRate: {
    resting: 65,
    average: 72
  },
  workouts: [],
  lastUpdated: new Date().toISOString(),
  isLoading: false,
  error: null,
};

export const fetchFitnessData = createAsyncThunk(
  "fitness/fetchData",
  async () => {
    // Return mock data instead of calling HealthKit
    return {
      steps: 5000,
      calories: 300,
      distance: 4.2,
      heartRate: {
        resting: 65,
        average: 72,
      },
      workouts: [],
      lastUpdated: new Date().toISOString(),
    };
    
    // Comment out the HealthKit code
    /*
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    try {
      const [steps, calories, distance, restingHR, averageHR, workouts] =
        await Promise.all([
          healthKitService.getTodayStepCount(startOfDay, endOfDay),
          healthKitService.fetchCaloriesBurned(startOfDay, endOfDay),
          healthKitService.fetchDistance(startOfDay, endOfDay),
          healthKitService.getRestingHeartRateForMonth(startOfDay, endOfDay),
          healthKitService.getAverageHeartRate(startOfDay, endOfDay),
          healthKitService.fetchWorkouts(startOfDay, endOfDay),
        ]);

      return {
        steps,
        calories,
        distance,
        heartRate: {
          resting: restingHR,
          average: averageHR,
        },
        workouts,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`Failed to fetch fitness data: ${error}`);
    }
    */
  },
);

const fitnessSlice = createSlice({
  name: "fitness",
  initialState,
  reducers: {
    resetFitnessData: () => {
      return initialState;
    },
    updateLastUpdated: (state) => {
      state.lastUpdated = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFitnessData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFitnessData.fulfilled, (state) => {
        return {
          ...state,
          isLoading: false,
          error: null,
        };
      })
      .addCase(fetchFitnessData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export const { resetFitnessData, updateLastUpdated } = fitnessSlice.actions;
export const fitnessReducer = fitnessSlice.reducer;
