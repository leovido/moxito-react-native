import { useLoginWithFarcaster, usePrivy } from '@privy-io/expo';
import * as Linking from 'expo-linking';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function AuthScreen() {
  const router = useRouter();
  const { user, isReady } = usePrivy();
  const { loginWithFarcaster, state } = useLoginWithFarcaster({
    onSuccess: (user) => {
      console.log('Farcaster login successful:', user);
      router.replace('/(tabs)/fitness');
    },
    onError: (error) => {
      console.error('Farcaster login error:', error);
    },
  });

  const handleLogin = async () => {
    try {
      // Use auth route path - iOS requires exact route matching
      // The onSuccess callback will handle navigation to tabs
      const redirectUrl = Linking.createURL('/(auth)');
      console.log('Redirect URL:', redirectUrl);
      await loginWithFarcaster({
        redirectUrl,
        relyingParty: process.env.EXPO_PUBLIC_RELYING_PARTY,
      });
    } catch (error) {
      console.error('Farcaster login error:', error);
    }
  };

  // Handle deep link redirects from Farcaster login
  // Privy will automatically process the deep link, but we listen for it to log
  useFocusEffect(
    useCallback(() => {
      const handleDeepLink = async () => {
        const url = await Linking.getInitialURL();
        if (url) {
          console.log('Deep link received on auth screen:', url);
          // Privy will process this automatically
          // We'll wait for the user state to update via the useEffect above
        }
      };
      handleDeepLink();

      // Listen for incoming links while app is running
      const subscription = Linking.addEventListener('url', (event) => {
        console.log('Incoming deep link on auth screen:', event.url);
        // Privy will process this automatically
        // The onSuccess callback or user state update will handle navigation
      });

      return () => {
        subscription.remove();
      };
    }, [])
  );

  // Wait for Privy to process authentication after deep link redirect
  useEffect(() => {
    console.log(`Auth state - isReady: ${isReady}, user:`, user ? 'exists' : 'null');

    // Give Privy time to process the authentication token from the deep link
    if (isReady && user) {
      console.log('User authenticated, redirecting to tabs');
      // Small delay to ensure state is fully updated
      const timer = setTimeout(() => {
        router.replace('/(tabs)/fitness');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isReady, user, router]);

  return (
    <>
      <Image source={require('../../assets/images/login.png')} style={styles.backgroundImage} />
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Sign in to Moxito with Farcaster</Text>
          {state.status === 'error' && state.error && (
            <Text style={styles.errorText}>{state.error.message}</Text>
          )}
          <Text style={styles.subtitle}>
            Sign in to the apps to display your profile or skip this step.
          </Text>
          <Pressable
            style={[styles.signInButton, state.status !== 'initial' && styles.signInButtonDisabled]}
            onPress={handleLogin}
            disabled={state.status !== 'initial'}
          >
            {state.status !== 'initial' ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signInButtonText}>Sign in with Farcaster</Text>
            )}
          </Pressable>
          <Pressable style={styles.skipButton} onPress={() => router.replace('/(tabs)/fitness')}>
            <Text style={styles.skipButtonText}>Skip this step</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
    margin: 20,
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontFamily: 'Lato_700Bold',
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 10,
  },
  skipButtonText: {
    marginTop: 20,
    color: '#000',
  },
  signInButtonText: {
    color: '#fff',
    fontFamily: 'Lato_700Bold',
    fontSize: 16,
  },
  signInButton: {
    backgroundColor: '#A87AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
  skipButton: {
    marginTop: 20,
    color: '#000',
  },
  errorText: {
    color: '#FF4444',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Lato_400Regular',
  },
});
