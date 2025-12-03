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
    const { getAllByText } = render(<WorkoutScreen />);

    // Start workout
    const startButton = getAllByText('Start Workout')[0];
    fireEvent.press(startButton);

    // Fast-forward time to trigger updates (wait a bit longer to ensure values are updated)
    act(() => {
      jest.advanceTimersByTime(2000); // 2 seconds
    });

    // Should have some steps and distance - there may be multiple (Live Data and Last Update)
    const stepsTexts = getAllByText(/👟 Steps:/);
    const distanceTexts = getAllByText(/📏 Distance:/);

    expect(stepsTexts.length).toBeGreaterThan(0);
    expect(distanceTexts.length).toBeGreaterThan(0);

    // Check that at least one has values greater than 0
    // The text might be split across children, so we need to check the full tree
    const hasNonZeroSteps = stepsTexts.some((text) => {
      // Get all text content from the element
      const getTextContent = (node: unknown): string => {
        if (typeof node === 'string' || typeof node === 'number') {
          return String(node);
        }
        if (Array.isArray(node)) {
          return node.map(getTextContent).join('');
        }
        if (node && typeof node === 'object' && 'props' in node) {
          return getTextContent((node as { props: { children?: unknown } }).props.children);
        }
        return '';
      };
      const content = getTextContent(text);
      const match = content.match(/👟 Steps:\s*(\d+)/);
      return match && parseInt(match[1], 10) > 0;
    });

    const hasNonZeroDistance = distanceTexts.some((text) => {
      const getTextContent = (node: unknown): string => {
        if (typeof node === 'string' || typeof node === 'number') {
          return String(node);
        }
        if (Array.isArray(node)) {
          return node.map(getTextContent).join('');
        }
        if (node && typeof node === 'object' && 'props' in node) {
          return getTextContent((node as { props: { children?: unknown } }).props.children);
        }
        return '';
      };
      const content = getTextContent(text);
      const match = content.match(/📏 Distance:\s*([\d.]+)m/);
      return match && parseFloat(match[1]) > 0;
    });

    expect(hasNonZeroSteps).toBe(true);
    expect(hasNonZeroDistance).toBe(true);
  });

  it('generates workout updates with correct data structure', async () => {
    const { getByText, getAllByText } = render(<WorkoutScreen />);

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

    // Check for required data fields in workout data section - use getAllByText since there may be duplicates
    expect(getAllByText(/⏰ Time:/).length).toBeGreaterThan(0);
    expect(getAllByText(/👟 Steps:/).length).toBeGreaterThan(0);
    expect(getAllByText(/📏 Distance:/).length).toBeGreaterThan(0);
    expect(getAllByText(/🏃 Pace:/).length).toBeGreaterThan(0);
    expect(getAllByText(/📍 Location:/).length).toBeGreaterThan(0);
    expect(getAllByText(/📱 Source:/).length).toBeGreaterThan(0);
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
