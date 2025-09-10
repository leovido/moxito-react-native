import { act, fireEvent, render, within } from '@testing-library/react-native';
import type React from 'react';
import WorkoutScreen from '../workout';

describe('WorkoutScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders correctly with initial state', () => {
    const { getByText } = render(<WorkoutScreen />);

    expect(getByText('Workout Tracking')).toBeTruthy();
    expect(getByText('Workout Controls')).toBeTruthy();
    expect(getByText('Start Workout')).toBeTruthy();
    expect(getByText('Live Data')).toBeTruthy();
    expect(getByText('Status')).toBeTruthy();
    expect(getByText('Workout: 🔴 Inactive')).toBeTruthy();

    // Initial data should show 0
    expect(getByText('👟 Steps: 0')).toBeTruthy();
    expect(getByText('📏 Distance: 0.00m')).toBeTruthy();
  });

  it('starts workout when start button is pressed', async () => {
    const { getByText, queryByText } = render(<WorkoutScreen />);

    const startButton = getByText('Start Workout');
    fireEvent.press(startButton);

    // Should show stop button and active status
    expect(queryByText('Start Workout')).toBeFalsy();
    expect(getByText('Stop Workout')).toBeTruthy();
    expect(getByText('Workout: 🟢 Active')).toBeTruthy();
  });

  it('stops workout when stop button is pressed', async () => {
    const { getByText, queryByText } = render(<WorkoutScreen />);

    // Start workout first
    const startButton = getByText('Start Workout');
    fireEvent.press(startButton);

    // Then stop it
    const stopButton = getByText('Stop Workout');
    fireEvent.press(stopButton);

    // Should show start button and inactive status
    expect(queryByText('Stop Workout')).toBeFalsy();
    expect(getByText('Start Workout')).toBeTruthy();
    expect(getByText('Workout: 🔴 Inactive')).toBeTruthy();
  });

  it('updates step count and distance during active workout', async () => {
    const { getByText } = render(<WorkoutScreen />);

    // Start workout
    const startButton = getByText('Start Workout');
    fireEvent.press(startButton);

    // Fast-forward time to trigger updates
    act(() => {
      jest.advanceTimersByTime(1000); // 1 second
    });

    // Should have some steps and distance in live data section
    const liveDataSection = getByText('Live Data').parent;
    const stepsText = within(liveDataSection).getByText('👟 Steps');
    const distanceText = within(liveDataSection).getByText('📏 Distance');

    expect(stepsText).toBeTruthy();
    expect(distanceText).toBeTruthy();

    // Values should be greater than 0
    const stepsMatch = stepsText.props.children.match(/👟 Steps: (\d+)/);
    const distanceMatch = distanceText.props.children.match(/📏 Distance: ([\d.]+)m/);

    expect(parseInt(stepsMatch[1], 10)).toBeGreaterThan(0);
    expect(parseFloat(distanceMatch[1])).toBeGreaterThan(0);
  });

  it('generates workout updates with correct data structure', async () => {
    const { getByText } = render(<WorkoutScreen />);

    // Start workout
    const startButton = getByText('Start Workout');
    fireEvent.press(startButton);

    // Fast-forward time to trigger updates
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Should show workout data section
    const lastUpdateSection = getByText('Last Update');
    expect(lastUpdateSection).toBeTruthy();

    // Check for required data fields in workout data section
    const workoutDataSection = getByText('Last Update').parent;
    expect(within(workoutDataSection).getByText('⏰ Time')).toBeTruthy();
    expect(within(workoutDataSection).getByText('👟 Steps')).toBeTruthy();
    expect(within(workoutDataSection).getByText('📏 Distance')).toBeTruthy();
    expect(within(workoutDataSection).getByText('🏃 Pace')).toBeTruthy();
    expect(within(workoutDataSection).getByText('📍 Location')).toBeTruthy();
    expect(within(workoutDataSection).getByText('📱 Source')).toBeTruthy();
  });

  it('cleans up interval when component unmounts', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    
    const { getByText, unmount } = render(<WorkoutScreen />);
    
    // Start a workout to ensure there's an interval to clean up
    const startButton = getByText('Start Workout');
    fireEvent.press(startButton);
    
    // Unmount component
    unmount();
    
    // Should have called clearInterval
    expect(clearIntervalSpy).toHaveBeenCalled();
    
    clearIntervalSpy.mockRestore();
  });

  it('resets workout data when starting new workout', async () => {
    const { getByText } = render(<WorkoutScreen />);

    // Start workout
    const startButton = getByText('Start Workout');
    fireEvent.press(startButton);

    // Let it run for a bit
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Stop workout
    const stopButton = getByText('Stop Workout');
    fireEvent.press(stopButton);

    // Start new workout
    const newStartButton = getByText('Start Workout');
    fireEvent.press(newStartButton);

    // Should reset to 0
    expect(getByText('👟 Steps: 0')).toBeTruthy();
    expect(getByText('📏 Distance: 0.00m')).toBeTruthy();
  });

  it('maintains workout state during rapid start/stop actions', async () => {
    const { getByText, queryByText } = render(<WorkoutScreen />);

    // Rapid start/stop sequence
    const startButton = getByText('Start Workout');
    fireEvent.press(startButton);

    // Immediately stop
    const stopButton = getByText('Stop Workout');
    fireEvent.press(stopButton);

    // Should be back to inactive state
    expect(queryByText('Stop Workout')).toBeFalsy();
    expect(getByText('Start Workout')).toBeTruthy();
    expect(getByText('Workout: 🔴 Inactive')).toBeTruthy();
  });

  it('displays correct duration status', () => {
    const { getByText } = render(<WorkoutScreen />);

    // Initially should show stopped
    expect(getByText('⏱️ Duration: Stopped')).toBeTruthy();

    // Start workout
    const startButton = getByText('Start Workout');
    fireEvent.press(startButton);

    // Should show active
    expect(getByText('⏱️ Duration: Active')).toBeTruthy();

    // Stop workout
    const stopButton = getByText('Stop Workout');
    fireEvent.press(stopButton);

    // Should show stopped again
    expect(getByText('⏱️ Duration: Stopped')).toBeTruthy();
  });
});
