// AuthContext.tsx

import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  url: string | null;
  authError: string | null;
  startLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [url, _setUrl] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [_fid, setFID] = useState(0);
  const [_signerToken, setSignerToken] = useState('');

  const handleDeepLink = (url: string) => {
    try {
      const urlObj = new URL(url);

      // Check if URL matches our scheme and host
      if (urlObj.protocol !== 'moxito:' || urlObj.hostname !== 'auth') {
        return;
      }

      // Get query parameters
      const params = new URLSearchParams(urlObj.search);
      const signer64 = params.get('id');
      const fid64 = params.get('fid');

      if (!signer64 || !fid64) {
        console.log('Required query items missing: signer or fid.');
        return;
      }

      // Decode base64 values
      try {
        const decodedSigner = Buffer.from(signer64, 'base64').toString('utf8');
        const decodedFID = Buffer.from(fid64, 'base64').toString('utf8');

        // Save to secure storage
        // SecureStore.setItemAsync(
        // 	`com.christianleovido.Moxito-${decodedFID}`,
        // 	decodedSigner
        // );

        // Update state/context
        setIsAuthenticated(true);
        // Assuming you have these state setters in your component
        setFID(parseInt(decodedFID, 10));
        setSignerToken(decodedSigner);
      } catch (error) {
        console.error('Failed to decode Base64 data:', error);
      }
    } catch (error) {
      console.error('Error handling deep link:', error);
    }
  };

  const startLogin = async () => {
    try {
      await WebBrowser.warmUpAsync();

      const redirectUrl = Linking.createURL('auth'); // This will create moxito://auth
      const authURL = `https://app.moxito.xyz/`;

      const result = await WebBrowser.openAuthSessionAsync(authURL, redirectUrl, {
        showInRecents: true,
        preferEphemeralSession: true,
      });

      await WebBrowser.coolDownAsync();

      if (result.type === 'success' && result.url) {
        handleDeepLink(result.url);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setAuthError(error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  const value = {
    isAuthenticated,
    url,
    authError,
    startLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
