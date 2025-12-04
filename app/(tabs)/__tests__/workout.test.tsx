import { act, fireEvent, render } from '@testing-library/react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import { WorkoutScreen } from '../../../components/WorkoutScreen';

type RenderAPI = ReturnType<typeof render>;
type GetByText = RenderAPI['getByText'];
type GetByLabelText = RenderAPI['getByLabelText'];

type NodeQuery = (testID: string) => ReactTestInstance;

function pressButton(target: Parameters<typeof fireEvent.press>[0]) {
  act(() => {
    fireEvent.press(target);
  });
}

function advanceTimers(ms: number) {
  act(() => {
    jest.advanceTimersByTime(ms);
    jest.runOnlyPendingTimers();
  });
}

function getNodeText(node: ReactTestInstance): string {
  const { children } = node.props;

  if (Array.isArray(children)) {
    return children.join('');
  }

  if (typeof children === 'number') {
    return String(children);
  }

  return children ?? '';
}

function expectWorkoutActive(getByText: GetByText, getByLabelText: GetByLabelText) {
  expect(getByLabelText('Stop workout')).toBeTruthy();
  expect(getByText('Workout is currently active')).toBeTruthy();
}

function expectWorkoutInactive(getByText: GetByText, getByLabelText: GetByLabelText) {
  expect(getByLabelText('Start workout')).toBeTruthy();
  expect(getByText('Workout is not active')).toBeTruthy();
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

  it('renders initial state with default metrics', () => {
    const { getByText, getByLabelText, getByTestId } = render(<WorkoutScreen />);

    expect(getByText('Hello, Leovido')).toBeTruthy();
    expect(getByText('Last update: Never')).toBeTruthy();
    expectWorkoutInactive(getByText, getByLabelText);

    expect(Number(getNodeText(getByTestId('steps-value')))).toBe(0);
    expect(Number(getNodeText(getByTestId('distance-value')))).toBe(0);
    expect(getNodeText(getByTestId('duration-value'))).toBe('0');
    expect(getNodeText(getByTestId('duration-unit'))).toBe('minutes');
  });

  it('starts workout when the action button is pressed', () => {
    const { getByLabelText, getByText, getByTestId } = render(<WorkoutScreen />);

    pressButton(getByLabelText('Start workout'));

    expectWorkoutActive(getByText, getByLabelText);
    expect(getNodeText(getByTestId('duration-value'))).toBe('Live');
    expect(getNodeText(getByTestId('duration-unit'))).toBe('active');
  });

  it('stops workout when the action button is pressed again', () => {
    const { getByLabelText, getByText, getByTestId } = render(<WorkoutScreen />);

    pressButton(getByLabelText('Start workout'));
    pressButton(getByLabelText('Stop workout'));

    expectWorkoutInactive(getByText, getByLabelText);
    expect(getNodeText(getByTestId('duration-value'))).toBe('0');
    expect(getNodeText(getByTestId('duration-unit'))).toBe('minutes');
  });

  it('updates live data metrics during an active workout', () => {
    const { getByLabelText, getByText, getByTestId } = render(<WorkoutScreen />);

    pressButton(getByLabelText('Start workout'));
    advanceTimers(2000);

    expect(Number(getNodeText(getByTestId('steps-value')))).toBeGreaterThan(0);
    expect(Number(getNodeText(getByTestId('distance-value')))).toBeGreaterThan(0);
    expect(getByText('Last update: Just now')).toBeTruthy();
  });

  it('shows last update details after data is generated', () => {
    const { getByLabelText, getByText, getByTestId } = render(<WorkoutScreen />);

    pressButton(getByLabelText('Start workout'));
    advanceTimers(1500);

    expect(getByText('Last Update Details')).toBeTruthy();
    expect(getByTestId('last-update-time')).toBeTruthy();
    expect(getByTestId('last-update-steps')).toBeTruthy();
    expect(getByTestId('last-update-distance')).toBeTruthy();
    expect(getByTestId('last-update-pace')).toBeTruthy();
    expect(getByTestId('last-update-location')).toBeTruthy();
    expect(getByTestId('last-update-source')).toBeTruthy();
  });

  it('cleans up the workout interval on unmount', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const { getByLabelText, unmount } = render(<WorkoutScreen />);

    pressButton(getByLabelText('Start workout'));
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it('resets metrics when starting a new workout session', () => {
    const { getByLabelText, getByTestId } = render(<WorkoutScreen />);

    pressButton(getByLabelText('Start workout'));
    advanceTimers(2000);
    pressButton(getByLabelText('Stop workout'));
    pressButton(getByLabelText('Start workout'));

    expect(Number(getNodeText(getByTestId('steps-value')))).toBe(0);
    expect(Number(getNodeText(getByTestId('distance-value')))).toBe(0);
  });

  it('maintains state during rapid start and stop actions', () => {
    const { getByLabelText, getByText } = render(<WorkoutScreen />);

    pressButton(getByLabelText('Start workout'));
    expectWorkoutActive(getByText, getByLabelText);

    pressButton(getByLabelText('Stop workout'));
    expectWorkoutInactive(getByText, getByLabelText);
  });

  it('updates duration indicators based on workout state', () => {
    const { getByLabelText, getByTestId } = render(<WorkoutScreen />);

    const durationValue: NodeQuery = (testID) => getByTestId(testID);

    expect(getNodeText(durationValue('duration-value'))).toBe('0');
    expect(getNodeText(durationValue('duration-unit'))).toBe('minutes');

    pressButton(getByLabelText('Start workout'));
    expect(getNodeText(durationValue('duration-value'))).toBe('Live');
    expect(getNodeText(durationValue('duration-unit'))).toBe('active');

    pressButton(getByLabelText('Stop workout'));
    expect(getNodeText(durationValue('duration-value'))).toBe('0');
    expect(getNodeText(durationValue('duration-unit'))).toBe('minutes');
  });
});
