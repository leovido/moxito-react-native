import { act, render, waitFor } from '@testing-library/react-native';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { AuthProvider, useAuth } from '../AuthProvider';

jest.mock('expo-linking', () => ({
  createURL: jest.fn(),
}));

jest.mock('expo-web-browser', () => ({
  warmUpAsync: jest.fn(),
  openAuthSessionAsync: jest.fn(),
  coolDownAsync: jest.fn(),
}));

type AuthContextShape = ReturnType<typeof useAuth>;

function ContextProbe({ onValue }: { onValue: (value: AuthContextShape) => void }) {
  const value = useAuth();
  onValue(value);
  return null;
}

const buildDeepLink = (signer: string, fid: string) => {
  const signer64 = Buffer.from(signer, 'utf8').toString('base64');
  const fid64 = Buffer.from(fid, 'utf8').toString('base64');
  return `moxito://auth?id=${signer64}&fid=${fid64}`;
};

describe('AuthProvider', () => {
  const mockCreateURL = Linking.createURL as jest.MockedFunction<typeof Linking.createURL>;
  const mockWarmUpAsync = WebBrowser.warmUpAsync as jest.MockedFunction<
    typeof WebBrowser.warmUpAsync
  >;
  const mockOpenAuthSessionAsync = WebBrowser.openAuthSessionAsync as jest.MockedFunction<
    typeof WebBrowser.openAuthSessionAsync
  >;
  const mockCoolDownAsync = WebBrowser.coolDownAsync as jest.MockedFunction<
    typeof WebBrowser.coolDownAsync
  >;

  let latestContext: AuthContextShape | undefined;

  const renderProvider = () => {
    const handleValue = (value: AuthContextShape) => {
      latestContext = value;
    };

    render(
      <AuthProvider>
        <ContextProbe onValue={handleValue} />
      </AuthProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    latestContext = undefined;
    mockCreateURL.mockReturnValue('moxito://auth');
    // mockWarmUpAsync.mockResolvedValue(undefined);
    // mockCoolDownAsync.mockResolvedValue(undefined);
  });

  it('provides default auth state values', () => {
    renderProvider();

    expect(latestContext).toBeDefined();
    expect(latestContext?.isAuthenticated).toBe(false);
    expect(latestContext?.authError).toBeNull();
    expect(typeof latestContext?.startLogin).toBe('function');
  });

  it('authenticates the user when a valid deep link is returned', async () => {
    mockOpenAuthSessionAsync.mockResolvedValue({
      type: 'success',
      url: buildDeepLink('signer-token', '123'),
    } as WebBrowser.WebBrowserAuthSessionResult);

    renderProvider();

    expect(latestContext).toBeDefined();

    await act(async () => {
      await latestContext?.startLogin();
    });

    await waitFor(() => {
      expect(latestContext?.isAuthenticated).toBe(true);
    });

    expect(mockWarmUpAsync).toHaveBeenCalledTimes(1);
    expect(mockCreateURL).toHaveBeenCalledWith('auth');
    expect(mockOpenAuthSessionAsync).toHaveBeenCalledWith(
      'https://app.moxito.xyz/',
      'moxito://auth',
      expect.objectContaining({
        preferEphemeralSession: true,
        showInRecents: true,
      })
    );
    expect(mockCoolDownAsync).toHaveBeenCalledTimes(1);
  });

  it('ignores responses that are missing required query params', async () => {
    mockOpenAuthSessionAsync.mockResolvedValue({
      type: 'success',
      url: 'moxito://auth?id=missing-fid',
    } as WebBrowser.WebBrowserAuthSessionResult);

    renderProvider();
    expect(latestContext).toBeDefined();

    await act(async () => {
      await latestContext?.startLogin();
    });

    await waitFor(() => {
      expect(latestContext?.isAuthenticated).toBe(false);
    });
  });

  it('ignores unexpected redirect domains', async () => {
    mockOpenAuthSessionAsync.mockResolvedValue({
      type: 'success',
      url: 'https://example.com/callback',
    } as WebBrowser.WebBrowserAuthSessionResult);

    renderProvider();
    expect(latestContext).toBeDefined();

    await act(async () => {
      await latestContext?.startLogin();
    });

    await waitFor(() => {
      expect(latestContext?.isAuthenticated).toBe(false);
    });
  });

  it('captures authentication errors from the web browser session', async () => {
    const error = new Error('network down');
    mockOpenAuthSessionAsync.mockRejectedValue(error);

    renderProvider();
    expect(latestContext).toBeDefined();

    await act(async () => {
      await latestContext?.startLogin();
    });

    await waitFor(() => {
      expect(latestContext?.authError).toBe('network down');
    });
  });
});
