import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { type Router, useRouter } from 'expo-router';
import { useAuth } from '../../../Context/AuthProvider';
import AuthScreen from '../index';

jest.mock('../AuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

type AuthContextShape = ReturnType<typeof useAuth>;

const renderAuthScreen = (overrides: Partial<AuthContextShape> = {}) => {
  const authState: AuthContextShape = {
    startLogin: jest.fn<Promise<void>, []>(),
    isAuthenticated: false,
    url: null,
    authError: null,
    ...overrides,
  };

  mockedUseAuth.mockReturnValue(authState);
  const utils = render(<AuthScreen />);
  return { authState, ...utils };
};

describe('AuthScreen', () => {
  let mockReplace: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReplace = jest.fn();
    mockedUseRouter.mockReturnValue({
      replace: mockReplace,
    } as Partial<Router> as Router);
  });

  it('renders expected instructional content', () => {
    const { getByText } = renderAuthScreen();

    expect(getByText('Sign in to Moxito with Farcaster')).toBeTruthy();
    expect(getByText('Sign in')).toBeTruthy();
    expect(getByText('Skip this step')).toBeTruthy();
  });

  it('calls startLogin when the sign in button is pressed', () => {
    const { getByText, authState } = renderAuthScreen();

    fireEvent.press(getByText('Sign in'));

    expect(authState.startLogin).toHaveBeenCalledTimes(1);
  });

  it('navigates to fitness when skip is pressed', () => {
    const { getByText } = renderAuthScreen();

    fireEvent.press(getByText('Skip this step'));

    expect(mockReplace).toHaveBeenCalledWith('/(tabs)/fitness');
  });

  it('shows auth error messages when provided', () => {
    const errorMessage = 'Authentication failed';
    const { getByText } = renderAuthScreen({ authError: errorMessage });

    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('redirects to the tabs stack when authentication completes', async () => {
    renderAuthScreen({ isAuthenticated: true });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)/fitness');
    });
  });
});
