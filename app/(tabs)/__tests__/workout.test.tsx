import { act, fireEvent, render } from '@testing-library/react-native';
import { WorkoutScreen } from '../../../components/WorkoutScreen';

type GetByText = ReturnType<typeof render>['getByText'];
type QueryByText = ReturnType<typeof render>['queryByText'];

function pressButton(target: Parameters<typeof fireEvent.press>[0]) {
  act(() => {
    fireEvent.press(target);
  });
}

function advanceTimers(ms: number) {
  act(() => {
    jest.advanceTimersByTime(ms);
  });
}

function expectWorkoutActive(getByText: GetByText, queryByText: QueryByText) {
  expect(queryByText('Start Workout')).toBeFalsy();
  expect(getByText('Stop Workout')).toBeTruthy();
  expect(getByText('Workout: 🟢 Active')).toBeTruthy();
}

function expectWorkoutInactive(getByText: GetByText, queryByText: QueryByText) {
  expect(queryByText('Stop Workout')).toBeFalsy();
  expect(getByText('Start Workout')).toBeTruthy();
  expect(getByText('Workout: 🔴 Inactive')).toBeTruthy();
}

describe('WorkoutScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
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
    pressButton(startButton);

    expectWorkoutActive(getByText, queryByText);
  });

  it('stops workout when stop button is pressed', async () => {
    const { getByText, queryByText } = render(<WorkoutScreen />);

    // Start workout first
    const startButton = getByText('Start Workout');
    pressButton(startButton);

    // Then stop it
    const stopButton = getByText('Stop Workout');
    pressButton(stopButton);

    expectWorkoutInactive(getByText, queryByText);
  });

  it('updates step count and distance during active workout', async () => {
    const { getByText, getByTestId } = render(<WorkoutScreen />);

    // Start workout
    const startButton = getByText('Start Workout');
    pressButton(startButton);

    // Fast-forward time to trigger updates
    advanceTimers(1000);

    // Should have some steps and distance in live data section
    const stepsText = getByTestId('live-data-steps');
    const distanceText = getByTestId('live-data-distance');

    expect(stepsText).toBeTruthy();
    expect(distanceText).toBeTruthy();

    // Values should be greater than 0
    const stepsMatch = stepsText.props.children.match(/👟 Steps: (\d+)/);
    const distanceMatch = distanceText.props.children.match(/📏 Distance: ([\d.]+)m/);

    expect(parseInt(stepsMatch[1], 10)).toBeGreaterThan(0);
    expect(parseFloat(distanceMatch[1])).toBeGreaterThan(0);
  });

  it('generates workout updates with correct data structure', async () => {
    const { getByText, getByTestId } = render(<WorkoutScreen />);

    // Start workout
    const startButton = getByText('Start Workout');
    pressButton(startButton);

    // Fast-forward time to trigger updates
    advanceTimers(1000);

    // Should show workout data section
    const lastUpdateSection = getByText('Last Update');
    expect(lastUpdateSection).toBeTruthy();

    // Check for required data fields in workout data section
    expect(getByTestId('last-update-time')).toBeTruthy();
    expect(getByTestId('last-update-steps')).toBeTruthy();
    expect(getByTestId('last-update-distance')).toBeTruthy();
    expect(getByTestId('last-update-pace')).toBeTruthy();
    expect(getByTestId('last-update-location')).toBeTruthy();
    expect(getByTestId('last-update-source')).toBeTruthy();
  });

  it('cleans up interval when component unmounts', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    const { getByText, unmount } = render(<WorkoutScreen />);

    // Start a workout to ensure there's an interval to clean up
    const startButton = getByText('Start Workout');
    pressButton(startButton);

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
    pressButton(startButton);

    // Let it run for a bit
    advanceTimers(2000);

    // Stop workout
    const stopButton = getByText('Stop Workout');
    pressButton(stopButton);

    // Start new workout
    const newStartButton = getByText('Start Workout');
    pressButton(newStartButton);

    // Should reset to 0
    expect(getByText('👟 Steps: 0')).toBeTruthy();
    expect(getByText('📏 Distance: 0.00m')).toBeTruthy();
  });

  it('maintains workout state during rapid start/stop actions', async () => {
    const { getByText, queryByText } = render(<WorkoutScreen />);

    // Rapid start/stop sequence
    const startButton = getByText('Start Workout');
    pressButton(startButton);
    expectWorkoutActive(getByText, queryByText);

    // Immediately stop
    const stopButton = getByText('Stop Workout');
    pressButton(stopButton);

    expectWorkoutInactive(getByText, queryByText);
  });

  it('displays correct duration status', () => {
    const { getByText } = render(<WorkoutScreen />);

    // Initially should show stopped
    expect(getByText('⏱️ Duration: Stopped')).toBeTruthy();

    // Start workout
    const startButton = getByText('Start Workout');
    pressButton(startButton);

    // Should show active
    expect(getByText('⏱️ Duration: Active')).toBeTruthy();

    // Stop workout
    const stopButton = getByText('Stop Workout');
    pressButton(stopButton);

    // Should show stopped again
    expect(getByText('⏱️ Duration: Stopped')).toBeTruthy();
  });
});
