import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { PrivyProvider } from '@privy-io/expo';
import { PrivyElements } from '@privy-io/expo/ui';

import { useFonts } from 'expo-font';
import { AuthProvider } from '../Context/AuthProvider';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const privyAppId = process.env.EXPO_PUBLIC_PRIVY_APP_ID || '';
  const privyClientId =
    process.env.EXPO_PUBLIC_PRIVY_CLIENT || process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID || '';

  const [loaded, error] = useFonts({
    Lato_400Regular: require('../assets/fonts/Lato_400Regular.ttf'),
    Lato_300Light: require('../assets/fonts/Lato_300Light.ttf'),
    Lato_700Bold: require('../assets/fonts/Lato_700Bold.ttf'),
    Lato_900Black: require('../assets/fonts/Lato_900Black.ttf'),
    Lato_100Thin: require('../assets/fonts/Lato_100Thin.ttf'),
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <PrivyProvider appId={privyAppId} clientId={privyClientId}>
        <PrivyElements />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </PrivyProvider>
    </AuthProvider>
  );
}
