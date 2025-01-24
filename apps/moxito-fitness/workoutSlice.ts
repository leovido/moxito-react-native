import { createSlice } from "@reduxjs/toolkit";

interface WorkoutState {
  isActive: boolean;
  startTime: number | null;
}

const initialState: WorkoutState = {
  isActive: false,
  startTime: null,
};

const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    startWorkout: (state) => {
      state.isActive = true;
      state.startTime = Date.now();
    },
    endWorkout: (state) => {
      state.isActive = false;
      state.startTime = null;
    },
  },
});

export const { startWorkout, endWorkout } = workoutSlice.actions;
export default workoutSlice.reducer;